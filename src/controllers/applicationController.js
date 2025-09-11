const { Application, Job, Shift, User } = require('../models');
const { successResponse, errorResponse, serverErrorResponse, notFoundResponse, paginatedResponse } = require('../helpers/response');
const { getPaginationParams, getPaginationMeta, buildSortOptions } = require('../helpers/pagination');
const { Op } = require('sequelize');

// Apply for a job
const applyForJob = async (req, res) => {
  try {
    const guardId = req.user.id;
    const { job_id, bid_rate, cover_letter } = req.body;

    // Check if job exists and is open
    const job = await Job.findByPk(job_id);
    if (!job) {
      return notFoundResponse(res, 'Job not found');
    }

    if (job.status !== 'open') {
      return errorResponse(res, 'Job is not available for applications', 400);
    }

    // Check if guard already applied
    const existingApplication = await Application.findOne({
      where: {
        guard_id: guardId,
        job_id: job_id
      }
    });

    if (existingApplication) {
      return errorResponse(res, 'You have already applied for this job', 400);
    }

    // Create application
    const application = await Application.create({
      guard_id: guardId,
      job_id: job_id,
      bid_rate: bid_rate || job.hourly_rate,
      cover_letter,
      status: 'applied'
    });

    // Fetch created application with relations
    const createdApplication = await Application.findByPk(application.id, {
      include: [
        {
          model: User,
          as: 'guard',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Job,
          as: 'job',
          include: [
            {
              model: User,
              as: 'company',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });

    return successResponse(res, 'Application submitted successfully', { application: createdApplication }, 201);

  } catch (error) {
    console.error('Apply for job error:', error);
    return serverErrorResponse(res, 'Failed to submit application', error);
  }
};

// Apply for a shift
const applyForShift = async (req, res) => {
  try {
    const guardId = req.user.id;
    const { shift_id, cover_letter } = req.body;

    // Check if shift exists and is open
    const shift = await Shift.findByPk(shift_id);
    if (!shift) {
      return notFoundResponse(res, 'Shift not found');
    }

    if (shift.status !== 'open') {
      return errorResponse(res, 'Shift is not available for applications', 400);
    }

    // Check if guard already applied
    const existingApplication = await Application.findOne({
      where: {
        guard_id: guardId,
        shift_id: shift_id
      }
    });

    if (existingApplication) {
      return errorResponse(res, 'You have already applied for this shift', 400);
    }

    // Create application
    const application = await Application.create({
      guard_id: guardId,
      shift_id: shift_id,
      cover_letter,
      status: 'applied'
    });

    // Fetch created application with relations
    const createdApplication = await Application.findByPk(application.id, {
      include: [
        {
          model: User,
          as: 'guard',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Shift,
          as: 'shift',
          include: [
            {
              model: User,
              as: 'company',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });

    return successResponse(res, 'Application submitted successfully', { application: createdApplication }, 201);

  } catch (error) {
    console.error('Apply for shift error:', error);
    return serverErrorResponse(res, 'Failed to submit application', error);
  }
};

// Get applications for a job (company view)
const getJobApplications = async (req, res) => {
  try {
    const { job_id } = req.params;
    const companyId = req.user.id;
    const {
      page = 1,
      limit = 10,
      status,
      sort_by = 'applied_at',
      sort_order = 'DESC'
    } = req.query;

    // Verify job belongs to company
    const job = await Job.findByPk(job_id);
    if (!job) {
      return notFoundResponse(res, 'Job not found');
    }

    if (job.company_id !== companyId) {
      return errorResponse(res, 'Unauthorized to view applications for this job', 403);
    }

    const { page: finalPage, limit: finalLimit, offset } = getPaginationParams(page, limit);

    const whereClause = { job_id };
    if (status) {
      whereClause.status = status;
    }

    const totalItems = await Application.count({ where: whereClause });

    const applications = await Application.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'guard',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      order: buildSortOptions(sort_by, sort_order),
      limit: finalLimit,
      offset
    });

    const pagination = getPaginationMeta(totalItems, finalPage, finalLimit);

    return paginatedResponse(res, 'Job applications retrieved successfully', applications.rows, pagination);

  } catch (error) {
    console.error('Get job applications error:', error);
    return serverErrorResponse(res, 'Failed to retrieve job applications', error);
  }
};

// Get applications for a shift (company view)
const getShiftApplications = async (req, res) => {
  try {
    const { shift_id } = req.params;
    const companyId = req.user.id;
    const {
      page = 1,
      limit = 10,
      status,
      sort_by = 'applied_at',
      sort_order = 'DESC'
    } = req.query;

    // Verify shift belongs to company
    const shift = await Shift.findByPk(shift_id);
    if (!shift) {
      return notFoundResponse(res, 'Shift not found');
    }

    if (shift.company_id !== companyId) {
      return errorResponse(res, 'Unauthorized to view applications for this shift', 403);
    }

    const { page: finalPage, limit: finalLimit, offset } = getPaginationParams(page, limit);

    const whereClause = { shift_id };
    if (status) {
      whereClause.status = status;
    }

    const totalItems = await Application.count({ where: whereClause });

    const applications = await Application.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'guard',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      order: buildSortOptions(sort_by, sort_order),
      limit: finalLimit,
      offset
    });

    const pagination = getPaginationMeta(totalItems, finalPage, finalLimit);

    return paginatedResponse(res, 'Shift applications retrieved successfully', applications.rows, pagination);

  } catch (error) {
    console.error('Get shift applications error:', error);
    return serverErrorResponse(res, 'Failed to retrieve shift applications', error);
  }
};

// Accept application
const acceptApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.id;

    const application = await Application.findByPk(id, {
      include: [
        {
          model: Job,
          as: 'job',
          required: false
        },
        {
          model: Shift,
          as: 'shift',
          required: false
        }
      ]
    });

    if (!application) {
      return notFoundResponse(res, 'Application not found');
    }

    // Verify company owns the job/shift
    const jobOrShift = application.job || application.shift;
    if (!jobOrShift || jobOrShift.company_id !== companyId) {
      return errorResponse(res, 'Unauthorized to accept this application', 403);
    }

    // Check if application is in applied status
    if (application.status !== 'applied') {
      return errorResponse(res, 'Application is not in applied status', 400);
    }

    // Update application status
    await application.update({
      status: 'accepted',
      responded_at: new Date()
    });

    // If it's a job application, update job status
    if (application.job_id) {
      const job = application.job;
      const newHiredGuards = job.hired_guards + 1;
      const newStatus = newHiredGuards >= job.required_guards ? 'hired' : 'hiring';
      
      await job.update({
        hired_guards: newHiredGuards,
        status: newStatus
      });
    }

    // If it's a shift application, assign guard to shift
    if (application.shift_id) {
      const shift = application.shift;
      await shift.update({
        guard_id: application.guard_id,
        status: 'assigned'
      });
    }

    // Fetch updated application
    const updatedApplication = await Application.findByPk(id, {
      include: [
        {
          model: User,
          as: 'guard',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Job,
          as: 'job',
          required: false
        },
        {
          model: Shift,
          as: 'shift',
          required: false
        }
      ]
    });

    return successResponse(res, 'Application accepted successfully', { application: updatedApplication });

  } catch (error) {
    console.error('Accept application error:', error);
    return serverErrorResponse(res, 'Failed to accept application', error);
  }
};

// Reject application
const rejectApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const companyId = req.user.id;

    const application = await Application.findByPk(id, {
      include: [
        {
          model: Job,
          as: 'job',
          required: false
        },
        {
          model: Shift,
          as: 'shift',
          required: false
        }
      ]
    });

    if (!application) {
      return notFoundResponse(res, 'Application not found');
    }

    // Verify company owns the job/shift
    const jobOrShift = application.job || application.shift;
    if (!jobOrShift || jobOrShift.company_id !== companyId) {
      return errorResponse(res, 'Unauthorized to reject this application', 403);
    }

    // Check if application is in applied status
    if (application.status !== 'applied') {
      return errorResponse(res, 'Application is not in applied status', 400);
    }

    // Update application status
    await application.update({
      status: 'rejected',
      responded_at: new Date(),
      notes: reason
    });

    return successResponse(res, 'Application rejected successfully');

  } catch (error) {
    console.error('Reject application error:', error);
    return serverErrorResponse(res, 'Failed to reject application', error);
  }
};

// Get guard's applications
const getGuardApplications = async (req, res) => {
  try {
    const guardId = req.user.id;
    const {
      page = 1,
      limit = 10,
      status,
      type, // 'job' or 'shift'
      sort_by = 'applied_at',
      sort_order = 'DESC'
    } = req.query;

    const { page: finalPage, limit: finalLimit, offset } = getPaginationParams(page, limit);

    const whereClause = { guard_id: guardId };
    if (status) {
      whereClause.status = status;
    }
    if (type === 'job') {
      whereClause.job_id = { [Op.ne]: null };
    } else if (type === 'shift') {
      whereClause.shift_id = { [Op.ne]: null };
    }

    const totalItems = await Application.count({ where: whereClause });

    const applications = await Application.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Job,
          as: 'job',
          required: false,
          include: [
            {
              model: User,
              as: 'company',
              attributes: ['id', 'name', 'email']
            }
          ]
        },
        {
          model: Shift,
          as: 'shift',
          required: false,
          include: [
            {
              model: User,
              as: 'company',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ],
      order: buildSortOptions(sort_by, sort_order),
      limit: finalLimit,
      offset
    });

    const pagination = getPaginationMeta(totalItems, finalPage, finalLimit);

    return paginatedResponse(res, 'Guard applications retrieved successfully', applications.rows, pagination);

  } catch (error) {
    console.error('Get guard applications error:', error);
    return serverErrorResponse(res, 'Failed to retrieve guard applications', error);
  }
};

module.exports = {
  applyForJob,
  applyForShift,
  getJobApplications,
  getShiftApplications,
  acceptApplication,
  rejectApplication,
  getGuardApplications
};