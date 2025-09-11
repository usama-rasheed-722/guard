const { Job, JobLocation, User, Application, Attendance } = require('../models');
const { successResponse, errorResponse, serverErrorResponse, notFoundResponse, paginatedResponse } = require('../helpers/response');
const { getPaginationParams, getPaginationMeta, buildSearchQuery, buildDateRangeQuery, buildSortOptions } = require('../helpers/pagination');
const { Op } = require('sequelize');

// Create a new job
const createJob = async (req, res) => {
  try {
    const companyId = req.user.id;
    const {
      title,
      description,
      date,
      start_time,
      end_time,
      hourly_rate,
      required_guards = 1,
      requirements,
      special_instructions,
      locations
    } = req.body;

    // Calculate total hours
    const startTime = new Date(`2000-01-01T${start_time}`);
    const endTime = new Date(`2000-01-01T${end_time}`);
    const totalHours = (endTime - startTime) / (1000 * 60 * 60);

    // Calculate total budget
    const totalBudget = totalHours * hourly_rate * required_guards;

    // Create job
    const job = await Job.create({
      company_id: companyId,
      title,
      description,
      date,
      start_time,
      end_time,
      hourly_rate,
      total_hours: totalHours,
      required_guards,
      total_budget: totalBudget,
      requirements,
      special_instructions
    });

    // Create job locations if provided
    if (locations && locations.length > 0) {
      const jobLocations = locations.map(location => ({
        job_id: job.id,
        ...location
      }));
      await JobLocation.bulkCreate(jobLocations);
    }

    // Fetch created job with locations
    const createdJob = await Job.findByPk(job.id, {
      include: [
        {
          model: JobLocation,
          as: 'locations'
        },
        {
          model: User,
          as: 'company',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    return successResponse(res, 'Job created successfully', { job: createdJob }, 201);

  } catch (error) {
    console.error('Create job error:', error);
    return serverErrorResponse(res, 'Failed to create job', error);
  }
};

// Get all jobs with filters and pagination
const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      date_from,
      date_to,
      min_rate,
      max_rate,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;

    const { page: finalPage, limit: finalLimit, offset } = getPaginationParams(page, limit);

    // Build where clause
    const whereClause = {};

    // Search filter
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Status filter
    if (status) {
      whereClause.status = status;
    }

    // Date range filter
    if (date_from || date_to) {
      whereClause.date = {};
      if (date_from) whereClause.date[Op.gte] = date_from;
      if (date_to) whereClause.date[Op.lte] = date_to;
    }

    // Rate range filter
    if (min_rate || max_rate) {
      whereClause.hourly_rate = {};
      if (min_rate) whereClause.hourly_rate[Op.gte] = min_rate;
      if (max_rate) whereClause.hourly_rate[Op.lte] = max_rate;
    }

    // Get total count
    const totalItems = await Job.count({ where: whereClause });

    // Get jobs with pagination
    const jobs = await Job.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: JobLocation,
          as: 'locations'
        },
        {
          model: User,
          as: 'company',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: buildSortOptions(sort_by, sort_order),
      limit: finalLimit,
      offset
    });

    const pagination = getPaginationMeta(totalItems, finalPage, finalLimit);

    return paginatedResponse(res, 'Jobs retrieved successfully', jobs.rows, pagination);

  } catch (error) {
    console.error('Get jobs error:', error);
    return serverErrorResponse(res, 'Failed to retrieve jobs', error);
  }
};

// Get job by ID
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id, {
      include: [
        {
          model: JobLocation,
          as: 'locations'
        },
        {
          model: User,
          as: 'company',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Application,
          as: 'applications',
          include: [
            {
              model: User,
              as: 'guard',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });

    if (!job) {
      return notFoundResponse(res, 'Job not found');
    }

    return successResponse(res, 'Job retrieved successfully', { job });

  } catch (error) {
    console.error('Get job by ID error:', error);
    return serverErrorResponse(res, 'Failed to retrieve job', error);
  }
};

// Update job
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.id;
    const updateData = req.body;

    const job = await Job.findByPk(id);
    if (!job) {
      return notFoundResponse(res, 'Job not found');
    }

    // Check if user owns this job
    if (job.company_id !== companyId) {
      return errorResponse(res, 'Unauthorized to update this job', 403);
    }

    // Check if job can be updated (not in progress or completed)
    if (['in_progress', 'completed'].includes(job.status)) {
      return errorResponse(res, 'Cannot update job that is in progress or completed', 400);
    }

    // Recalculate total hours and budget if time or rate changed
    if (updateData.start_time || updateData.end_time || updateData.hourly_rate) {
      const startTime = new Date(`2000-01-01T${updateData.start_time || job.start_time}`);
      const endTime = new Date(`2000-01-01T${updateData.end_time || job.end_time}`);
      const totalHours = (endTime - startTime) / (1000 * 60 * 60);
      const hourlyRate = updateData.hourly_rate || job.hourly_rate;
      const requiredGuards = updateData.required_guards || job.required_guards;

      updateData.total_hours = totalHours;
      updateData.total_budget = totalHours * hourlyRate * requiredGuards;
    }

    await job.update(updateData);

    // Fetch updated job with relations
    const updatedJob = await Job.findByPk(id, {
      include: [
        {
          model: JobLocation,
          as: 'locations'
        },
        {
          model: User,
          as: 'company',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    return successResponse(res, 'Job updated successfully', { job: updatedJob });

  } catch (error) {
    console.error('Update job error:', error);
    return serverErrorResponse(res, 'Failed to update job', error);
  }
};

// Delete job
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.id;

    const job = await Job.findByPk(id);
    if (!job) {
      return notFoundResponse(res, 'Job not found');
    }

    // Check if user owns this job
    if (job.company_id !== companyId) {
      return errorResponse(res, 'Unauthorized to delete this job', 403);
    }

    // Check if job can be deleted
    if (['in_progress', 'completed'].includes(job.status)) {
      return errorResponse(res, 'Cannot delete job that is in progress or completed', 400);
    }

    await job.destroy();

    return successResponse(res, 'Job deleted successfully');

  } catch (error) {
    console.error('Delete job error:', error);
    return serverErrorResponse(res, 'Failed to delete job', error);
  }
};

// Get company's jobs
const getCompanyJobs = async (req, res) => {
  try {
    const companyId = req.user.id;
    const {
      page = 1,
      limit = 10,
      status,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;

    const { page: finalPage, limit: finalLimit, offset } = getPaginationParams(page, limit);

    const whereClause = { company_id: companyId };
    if (status) {
      whereClause.status = status;
    }

    const totalItems = await Job.count({ where: whereClause });

    const jobs = await Job.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: JobLocation,
          as: 'locations'
        },
        {
          model: Application,
          as: 'applications',
          include: [
            {
              model: User,
              as: 'guard',
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

    return paginatedResponse(res, 'Company jobs retrieved successfully', jobs.rows, pagination);

  } catch (error) {
    console.error('Get company jobs error:', error);
    return serverErrorResponse(res, 'Failed to retrieve company jobs', error);
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getCompanyJobs
};