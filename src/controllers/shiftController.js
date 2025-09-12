const { Shift, User, Application, Attendance, CompanyLocation, ShiftAssignment } = require('../models');
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
      start_time,
      end_time,
      days_of_week, // array of days of the week
      hourly_rate,
      start_date,
      end_date,
      requirements,
      special_instructions,
      company_location_id
    } = req.body;

    const cl = await CompanyLocation.findOne({ where: { id: company_location_id, company_id: companyId } });
    if (!cl) return errorResponse(res, 'Invalid company location', 400);
    loc = {
      location_name: cl.location_name,
      address: cl.address,
      latitude: cl.latitude,
      longitude: cl.longitude
    };
  
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
      company_location_id
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
          model: ShiftAssignment,
          as: 'assignments',
          include: [
            {
              model: User,
              as: 'guard',
              attributes: ['id', 'name', 'email']
            }
          ],
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
          model: ShiftAssignment,
          as: 'assignments',
          include: [
            {
              model: User,
              as: 'guard',
              attributes: ['id', 'name', 'email']
            },
            {
              model: User,
              as: 'assignedBy',
              attributes: ['id', 'name', 'email']
            }
          ],
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
    const { guard_id, notes } = req.body;
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
    const guard = await User.findOne({
      where: { 
        id: guard_id, 
        role: 'guard', 
        status: 'active' 
      }
    });

    if (!guard) {
      return errorResponse(res, 'Guard not found or not active', 404);
    }

    // Check if guard is already assigned to this shift (excluding removed assignments)
    const existingAssignment = await ShiftAssignment.findOne({
      where: {
        shift_id: id,
        guard_id: guard_id,
        status: { [Op.ne]: 'removed' }
      }
    });

    if (existingAssignment) {
      return errorResponse(res, 'Guard is already assigned to this shift', 400);
    }

    // Create shift assignment
    const assignment = await ShiftAssignment.create({
      shift_id: id,
      guard_id: guard_id,
      assigned_by: companyId,
      notes: notes || null
    });

    // Update shift status to assigned if it's the first active assignment
    const assignmentCount = await ShiftAssignment.count({
      where: { shift_id: id, status: { [Op.notIn]: ['rejected', 'removed'] } }
    });

    if (assignmentCount === 1) {
      await shift.update({ status: 'assigned' });
    }

    // Fetch updated shift with assignments
    const updatedShift = await Shift.findByPk(id, {
      include: [
        {
          model: User,
          as: 'company',
          attributes: ['id', 'name', 'email']
        },
        {
          model: ShiftAssignment,
          as: 'assignments',
          include: [
            {
              model: User,
              as: 'guard',
              attributes: ['id', 'name', 'email']
            },
            {
              model: User,
              as: 'assignedBy',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });

    return successResponse(res, 'Guard assigned to shift successfully', { 
      shift: updatedShift,
      assignment: assignment
    });

  } catch (error) {
    console.error('Assign guard error:', error);
    return serverErrorResponse(res, 'Failed to assign guard', error);
  }
};

// Remove guard from shift
const removeGuard = async (req, res) => {
  try {
    const { id, assignment_id } = req.params;
    const companyId = req.user.id;

    const shift = await Shift.findByPk(id);
    if (!shift) {
      return notFoundResponse(res, 'Shift not found');
    }

    // Check if user owns this shift
    if (shift.company_id !== companyId) {
      return errorResponse(res, 'Unauthorized to remove guard from this shift', 403);
    }

    // Find the assignment
    const assignment = await ShiftAssignment.findOne({
      where: {
        id: assignment_id,
        shift_id: id
      }
    });

    if (!assignment) {
      return notFoundResponse(res, 'Assignment not found');
    }

    // Check if assignment can be removed
    if (assignment.status === 'removed') {
      return errorResponse(res, 'Guard is already removed from this shift', 400);
    }

    // Update assignment status to removed instead of deleting
    await assignment.update({ status: 'removed' });

    // Check if there are any remaining active assignments (excluding removed and rejected)
    const remainingActiveAssignments = await ShiftAssignment.count({
      where: { 
        shift_id: id, 
        status: { [Op.notIn]: ['rejected', 'removed'] } 
      }
    });

    // Update shift status to open if no active assignments remain
    if (remainingActiveAssignments === 0) {
      await shift.update({ status: 'open' });
    }

    // Fetch updated assignment with guard info
    const updatedAssignment = await ShiftAssignment.findByPk(assignment_id, {
      include: [
        {
          model: User,
          as: 'guard',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'assignedBy',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    return successResponse(res, 'Guard removed from shift successfully', { 
      assignment: updatedAssignment 
    });

  } catch (error) {
    console.error('Remove guard error:', error);
    return serverErrorResponse(res, 'Failed to remove guard', error);
  }
};

// Update assignment status (for guards to accept/reject assignments)
const updateAssignmentStatus = async (req, res) => {
  try {
    const { id, assignment_id } = req.params;
    const { status } = req.body;
    const guardId = req.user.id;

    // Validate status
    const validStatuses = ['accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, 'Invalid status. Must be accepted or rejected', 400);
    }

    // Find the assignment
    const assignment = await ShiftAssignment.findOne({
      where: {
        id: assignment_id,
        shift_id: id,
        guard_id: guardId
      }
    });

    if (!assignment) {
      return notFoundResponse(res, 'Assignment not found');
    }

    // Check if assignment can be updated
    if (assignment.status !== 'assigned') {
      return errorResponse(res, 'Assignment status cannot be changed', 400);
    }

    // Update assignment
    const updateData = { status };
    if (status === 'accepted') {
      updateData.accepted_at = new Date();
    }

    await assignment.update(updateData);

    // If accepted, update shift status to active
    if (status === 'accepted') {
      const shift = await Shift.findByPk(id);
      await shift.update({ status: 'active' });
    }

    return successResponse(res, `Assignment ${status} successfully`, { assignment });

  } catch (error) {
    console.error('Update assignment status error:', error);
    return serverErrorResponse(res, 'Failed to update assignment status', error);
  }
};

// Get shift assignments
const getShiftAssignments = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.id;

    const shift = await Shift.findByPk(id);
    if (!shift) {
      return notFoundResponse(res, 'Shift not found');
    }

    // Check if user owns this shift
    if (shift.company_id !== companyId) {
      return errorResponse(res, 'Unauthorized to view shift assignments', 403);
    }

    const assignments = await ShiftAssignment.findAll({
      where: { shift_id: id },
      include: [
        {
          model: User,
          as: 'guard',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: User,
          as: 'assignedBy',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['assigned_at', 'DESC']]
    });

    return successResponse(res, 'Shift assignments retrieved successfully', { assignments });

  } catch (error) {
    console.error('Get shift assignments error:', error);
    return serverErrorResponse(res, 'Failed to get shift assignments', error);
  }
};

// Get count of guards working on a shift
const getShiftGuardCount = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.id;

    const shift = await Shift.findByPk(id);
    if (!shift) {
      return notFoundResponse(res, 'Shift not found');
    }

    // Check if user owns this shift
    if (shift.company_id !== companyId) {
      return errorResponse(res, 'Unauthorized to view shift guard count', 403);
    }

    // Count active assignments (accepted, active, completed) - excluding removed and rejected
    const activeGuardCount = await ShiftAssignment.count({
      where: { 
        shift_id: id,
        status: { [Op.in]: ['accepted', 'active', 'completed'] }
      }
    });

    // Count total assignments (including assigned, rejected, terminated)
    const totalAssignments = await ShiftAssignment.count({
      where: { shift_id: id }
    });

    // Count by status
    const statusCounts = await ShiftAssignment.findAll({
      where: { shift_id: id },
      attributes: [
        'status',
        [ShiftAssignment.sequelize.fn('COUNT', ShiftAssignment.sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    const statusBreakdown = statusCounts.reduce((acc, item) => {
      acc[item.status] = parseInt(item.count);
      return acc;
    }, {});

    return successResponse(res, 'Shift guard count retrieved successfully', {
      shift_id: id,
      active_guards: activeGuardCount,
      total_assignments: totalAssignments,
      status_breakdown: statusBreakdown
    });

  } catch (error) {
    console.error('Get shift guard count error:', error);
    return serverErrorResponse(res, 'Failed to get shift guard count', error);
  }
};

// Get list of guards working on a shift
const getShiftGuards = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query; // Optional filter by status
    const companyId = req.user.id;

    const shift = await Shift.findByPk(id);
    if (!shift) {
      return notFoundResponse(res, 'Shift not found');
    }

    // Check if user owns this shift
    if (shift.company_id !== companyId) {
      return errorResponse(res, 'Unauthorized to view shift guards', 403);
    }

    // Build where clause
    const whereClause = { shift_id: id };
    if (status) {
      whereClause.status = status;
    }

    const assignments = await ShiftAssignment.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'guard',
          attributes: ['id', 'name', 'email', 'phone', 'status'],
          include: [
            {
              model: require('../models').GuardProfile,
              as: 'guardProfile',
              attributes: ['id', 'experience_years', 'specializations', 'certifications'],
              required: false
            }
          ]
        },
        {
          model: User,
          as: 'assignedBy',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['assigned_at', 'DESC']]
    });

    // Transform data to focus on guard information
    const guards = assignments.map(assignment => ({
      assignment_id: assignment.id,
      guard: assignment.guard,
      status: assignment.status,
      assigned_at: assignment.assigned_at,
      accepted_at: assignment.accepted_at,
      assigned_by: assignment.assignedBy,
      notes: assignment.notes
    }));

    return successResponse(res, 'Shift guards retrieved successfully', {
      shift_id: id,
      guards: guards,
      total_count: guards.length
    });

  } catch (error) {
    console.error('Get shift guards error:', error);
    return serverErrorResponse(res, 'Failed to get shift guards', error);
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
          model: ShiftAssignment,
          as: 'assignments',
          include: [
            {
              model: User,
              as: 'guard',
              attributes: ['id', 'name', 'email']
            }
          ],
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

    // Build where clause for assignments
    const assignmentWhereClause = { guard_id: guardId };
    if (status) {
      assignmentWhereClause.status = status;
    }

    // Get assignments with pagination
    const assignments = await ShiftAssignment.findAndCountAll({
      where: assignmentWhereClause,
      include: [
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
      ],
      order: buildSortOptions(sort_by, sort_order),
      limit: finalLimit,
      offset
    });

    const pagination = getPaginationMeta(assignments.count, finalPage, finalLimit);

    return paginatedResponse(res, 'Guard shifts retrieved successfully', assignments.rows, pagination);

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
  updateAssignmentStatus,
  getShiftAssignments,
  getShiftGuardCount,
  getShiftGuards,
  getCompanyShifts,
  getGuardShifts
};