const { Shift, User, Application, Attendance, CompanyLocation } = require('../models');
const { successResponse, errorResponse, serverErrorResponse, notFoundResponse, paginatedResponse } = require('../helpers/response');
const { getPaginationParams, getPaginationMeta, buildSearchQuery, buildDateRangeQuery, buildSortOptions } = require('../helpers/pagination');
const { Op } = require('sequelize');

// Create a new shift
const createShift = async (req, res) => {
  try {
    const companyId = req.user.id;
    const {
      title,
      description,
      location_name,
      address,
      latitude,
      longitude,
      start_time,
      end_time,
      days_of_week,
      hourly_rate,
      start_date,
      end_date,
      requirements,
      special_instructions,
      company_location_id
    } = req.body;

    let loc = { location_name, address, latitude, longitude };
    let companyLocationIdToSave = company_location_id || null;
    if (company_location_id) {
      const cl = await CompanyLocation.findOne({ where: { id: company_location_id, company_id: companyId } });
      if (!cl) return errorResponse(res, 'Invalid company location', 400);
      loc = {
        location_name: cl.location_name,
        address: cl.address,
        latitude: cl.latitude,
        longitude: cl.longitude
      };
    }

    // Create shift
    const shift = await Shift.create({
      company_id: companyId,
      title,
      description,
      ...loc,
      start_time,
      end_time,
      days_of_week,
      hourly_rate,
      start_date,
      end_date,
      requirements,
      special_instructions,
      company_location_id: companyLocationIdToSave
    });

    // Fetch created shift with company info
    const createdShift = await Shift.findByPk(shift.id, {
      include: [
        {
          model: User,
          as: 'company',
          attributes: ['id', 'name', 'email']
        },
        {
          model: CompanyLocation,
          as: 'companyLocation',
          required: false
        }
      ]
    });

    return successResponse(res, 'Shift created successfully', { shift: createdShift }, 201);

  } catch (error) {
    console.error('Create shift error:', error);
    return serverErrorResponse(res, 'Failed to create shift', error);
  }
};

// Get all shifts with filters and pagination
const getShifts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      start_date_from,
      start_date_to,
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
        { description: { [Op.iLike]: `%${search}%` } },
        { location_name: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Status filter
    if (status) {
      whereClause.status = status;
    }

    // Date range filter
    if (start_date_from || start_date_to) {
      whereClause.start_date = {};
      if (start_date_from) whereClause.start_date[Op.gte] = start_date_from;
      if (start_date_to) whereClause.start_date[Op.lte] = start_date_to;
    }

    // Rate range filter
    if (min_rate || max_rate) {
      whereClause.hourly_rate = {};
      if (min_rate) whereClause.hourly_rate[Op.gte] = min_rate;
      if (max_rate) whereClause.hourly_rate[Op.lte] = max_rate;
    }

    // Get total count
    const totalItems = await Shift.count({ where: whereClause });

    // Get shifts with pagination
    const shifts = await Shift.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'company',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'guard',
          attributes: ['id', 'name', 'email'],
          required: false
        }
      ],
      order: buildSortOptions(sort_by, sort_order),
      limit: finalLimit,
      offset
    });

    const pagination = getPaginationMeta(totalItems, finalPage, finalLimit);

    return paginatedResponse(res, 'Shifts retrieved successfully', shifts.rows, pagination);

  } catch (error) {
    console.error('Get shifts error:', error);
    return serverErrorResponse(res, 'Failed to retrieve shifts', error);
  }
};

// Get shift by ID
const getShiftById = async (req, res) => {
  try {
    const { id } = req.params;

    const shift = await Shift.findByPk(id, {
      include: [
        {
          model: User,
          as: 'company',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'guard',
          attributes: ['id', 'name', 'email'],
          required: false
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

    if (!shift) {
      return notFoundResponse(res, 'Shift not found');
    }

    return successResponse(res, 'Shift retrieved successfully', { shift });

  } catch (error) {
    console.error('Get shift by ID error:', error);
    return serverErrorResponse(res, 'Failed to retrieve shift', error);
  }
};

// Update shift
const updateShift = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.id;
    const updateData = { ...req.body };

    const shift = await Shift.findByPk(id);
    if (!shift) {
      return notFoundResponse(res, 'Shift not found');
    }

    // Check if user owns this shift
    if (shift.company_id !== companyId) {
      return errorResponse(res, 'Unauthorized to update this shift', 403);
    }

    // Check if shift can be updated
    if (['active', 'completed'].includes(shift.status)) {
      return errorResponse(res, 'Cannot update shift that is active or completed', 400);
    }

    // Handle company_location_id switch
    if (updateData.company_location_id) {
      const cl = await CompanyLocation.findOne({ where: { id: updateData.company_location_id, company_id: companyId } });
      if (!cl) return errorResponse(res, 'Invalid company location', 400);
      updateData.location_name = cl.location_name;
      updateData.address = cl.address;
      updateData.latitude = cl.latitude;
      updateData.longitude = cl.longitude;
    }

    await shift.update(updateData);

    // Fetch updated shift with relations
    const updatedShift = await Shift.findByPk(id, {
      include: [
        {
          model: User,
          as: 'company',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'guard',
          attributes: ['id', 'name', 'email'],
          required: false
        },
        {
          model: CompanyLocation,
          as: 'companyLocation',
          required: false
        }
      ]
    });

    return successResponse(res, 'Shift updated successfully', { shift: updatedShift });

  } catch (error) {
    console.error('Update shift error:', error);
    return serverErrorResponse(res, 'Failed to update shift', error);
  }
};

// Delete shift
const deleteShift = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.id;

    const shift = await Shift.findByPk(id);
    if (!shift) {
      return notFoundResponse(res, 'Shift not found');
    }

    // Check if user owns this shift
    if (shift.company_id !== companyId) {
      return errorResponse(res, 'Unauthorized to delete this shift', 403);
    }

    // Check if shift can be deleted
    if (['active', 'completed'].includes(shift.status)) {
      return errorResponse(res, 'Cannot delete shift that is active or completed', 400);
    }

    await shift.destroy();

    return successResponse(res, 'Shift deleted successfully');

  } catch (error) {
    console.error('Delete shift error:', error);
    return serverErrorResponse(res, 'Failed to delete shift', error);
  }
};

// Assign guard to shift
const assignGuard = async (req, res) => {
  try {
    const { id } = req.params;
    const { guard_id } = req.body;
    const companyId = req.user.id;

    const shift = await Shift.findByPk(id);
    if (!shift) {
      return notFoundResponse(res, 'Shift not found');
    }

    // Check if user owns this shift
    if (shift.company_id !== companyId) {
      return errorResponse(res, 'Unauthorized to assign guard to this shift', 403);
    }

    // Check if shift is available for assignment
    if (shift.status !== 'open') {
      return errorResponse(res, 'Shift is not available for assignment', 400);
    }

    // Verify guard exists and is active
    const guard = await User.findByPk(guard_id, {
      where: { role: 'guard', status: 'active' }
    });

    if (!guard) {
      return errorResponse(res, 'Guard not found or not active', 404);
    }

    // Update shift
    await shift.update({
      guard_id,
      status: 'assigned'
    });

    // Fetch updated shift
    const updatedShift = await Shift.findByPk(id, {
      include: [
        {
          model: User,
          as: 'company',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'guard',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    return successResponse(res, 'Guard assigned to shift successfully', { shift: updatedShift });

  } catch (error) {
    console.error('Assign guard error:', error);
    return serverErrorResponse(res, 'Failed to assign guard', error);
  }
};

// Remove guard from shift
const removeGuard = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.id;

    const shift = await Shift.findByPk(id);
    if (!shift) {
      return notFoundResponse(res, 'Shift not found');
    }

    // Check if user owns this shift
    if (shift.company_id !== companyId) {
      return errorResponse(res, 'Unauthorized to remove guard from this shift', 403);
    }

    // Check if shift has a guard assigned
    if (!shift.guard_id) {
      return errorResponse(res, 'No guard assigned to this shift', 400);
    }

    // Update shift
    await shift.update({
      guard_id: null,
      status: 'open'
    });

    return successResponse(res, 'Guard removed from shift successfully');

  } catch (error) {
    console.error('Remove guard error:', error);
    return serverErrorResponse(res, 'Failed to remove guard', error);
  }
};

// Get company's shifts
const getCompanyShifts = async (req, res) => {
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

    const totalItems = await Shift.count({ where: whereClause });

    const shifts = await Shift.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'guard',
          attributes: ['id', 'name', 'email'],
          required: false
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

    return paginatedResponse(res, 'Company shifts retrieved successfully', shifts.rows, pagination);

  } catch (error) {
    console.error('Get company shifts error:', error);
    return serverErrorResponse(res, 'Failed to retrieve company shifts', error);
  }
};

// Get guard's shifts
const getGuardShifts = async (req, res) => {
  try {
    const guardId = req.user.id;
    const {
      page = 1,
      limit = 10,
      status,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;

    const { page: finalPage, limit: finalLimit, offset } = getPaginationParams(page, limit);

    const whereClause = { guard_id: guardId };
    if (status) {
      whereClause.status = status;
    }

    const totalItems = await Shift.count({ where: whereClause });

    const shifts = await Shift.findAndCountAll({
      where: whereClause,
      include: [
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

    return paginatedResponse(res, 'Guard shifts retrieved successfully', shifts.rows, pagination);

  } catch (error) {
    console.error('Get guard shifts error:', error);
    return serverErrorResponse(res, 'Failed to retrieve guard shifts', error);
  }
};

module.exports = {
  createShift,
  getShifts,
  getShiftById,
  updateShift,
  deleteShift,
  assignGuard,
  removeGuard,
  getCompanyShifts,
  getGuardShifts
};