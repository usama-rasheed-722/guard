const { Attendance, Job, Shift, User } = require('../models');
const { successResponse, errorResponse, serverErrorResponse, notFoundResponse, paginatedResponse } = require('../helpers/response');
const { getPaginationParams, getPaginationMeta, buildSortOptions } = require('../helpers/pagination');
const moment = require('moment');

// Check in for job or shift
const checkIn = async (req, res) => {
  try {
    const guardId = req.user.id;
    const { job_id, shift_id, latitude, longitude, notes } = req.body;
    const checkInPhoto = req.file ? req.file.path : null;

    // Validate that either job_id or shift_id is provided, but not both
    if ((!job_id && !shift_id) || (job_id && shift_id)) {
      return errorResponse(res, 'Either job_id or shift_id must be provided, but not both', 400);
    }

    const today = moment().format('YYYY-MM-DD');

    // Check if attendance record already exists for today
    const existingAttendance = await Attendance.findOne({
      where: {
        guard_id: guardId,
        date: today,
        ...(job_id ? { job_id } : { shift_id })
      }
    });

    if (existingAttendance) {
      if (existingAttendance.check_in_time) {
        return errorResponse(res, 'Already checked in for today', 400);
      }
    }

    // Verify job or shift exists and guard is assigned
    if (job_id) {
      const job = await Job.findByPk(job_id);
      if (!job) {
        return notFoundResponse(res, 'Job not found');
      }
      // Check if guard is hired for this job (you might need to add this logic)
    } else if (shift_id) {
      const shift = await Shift.findByPk(shift_id);
      if (!shift) {
        return notFoundResponse(res, 'Shift not found');
      }
      if (shift.guard_id !== guardId) {
        return errorResponse(res, 'You are not assigned to this shift', 403);
      }
    }

    // Create or update attendance record
    const attendanceData = {
      guard_id: guardId,
      date: today,
      check_in_time: new Date(),
      check_in_latitude: latitude,
      check_in_longitude: longitude,
      check_in_photo: checkInPhoto,
      status: 'checked_in',
      notes
    };

    if (job_id) {
      attendanceData.job_id = job_id;
    } else {
      attendanceData.shift_id = shift_id;
    }

    let attendance;
    if (existingAttendance) {
      attendance = await existingAttendance.update(attendanceData);
    } else {
      attendance = await Attendance.create(attendanceData);
    }

    // Fetch attendance with relations
    const attendanceWithRelations = await Attendance.findByPk(attendance.id, {
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
      ]
    });

    return successResponse(res, 'Checked in successfully', { attendance: attendanceWithRelations });

  } catch (error) {
    console.error('Check in error:', error);
    return serverErrorResponse(res, 'Failed to check in', error);
  }
};

// Check out for job or shift
const checkOut = async (req, res) => {
  try {
    const guardId = req.user.id;
    const { job_id, shift_id, latitude, longitude, notes } = req.body;
    const checkOutPhoto = req.file ? req.file.path : null;

    // Validate that either job_id or shift_id is provided, but not both
    if ((!job_id && !shift_id) || (job_id && shift_id)) {
      return errorResponse(res, 'Either job_id or shift_id must be provided, but not both', 400);
    }

    const today = moment().format('YYYY-MM-DD');

    // Find attendance record for today
    const attendance = await Attendance.findOne({
      where: {
        guard_id: guardId,
        date: today,
        ...(job_id ? { job_id } : { shift_id })
      }
    });

    if (!attendance) {
      return errorResponse(res, 'No check-in record found for today', 400);
    }

    if (!attendance.check_in_time) {
      return errorResponse(res, 'Must check in before checking out', 400);
    }

    if (attendance.check_out_time) {
      return errorResponse(res, 'Already checked out for today', 400);
    }

    // Calculate hours worked
    const checkInTime = moment(attendance.check_in_time);
    const checkOutTime = moment();
    const hoursWorked = checkOutTime.diff(checkInTime, 'hours', true);

    // Update attendance record
    await attendance.update({
      check_out_time: checkOutTime.toDate(),
      check_out_latitude: latitude,
      check_out_longitude: longitude,
      check_out_photo: checkOutPhoto,
      hours_worked: hoursWorked,
      status: 'checked_out',
      notes: notes || attendance.notes
    });

    // Fetch updated attendance with relations
    const updatedAttendance = await Attendance.findByPk(attendance.id, {
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
      ]
    });

    return successResponse(res, 'Checked out successfully', { attendance: updatedAttendance });

  } catch (error) {
    console.error('Check out error:', error);
    return serverErrorResponse(res, 'Failed to check out', error);
  }
};

// Get attendance records
const getAttendance = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      date_from,
      date_to,
      status,
      job_id,
      shift_id,
      sort_by = 'date',
      sort_order = 'DESC'
    } = req.query;

    const { page: finalPage, limit: finalLimit, offset } = getPaginationParams(page, limit);

    // Build where clause
    const whereClause = {};

    // Date range filter
    if (date_from || date_to) {
      whereClause.date = {};
      if (date_from) whereClause.date.gte = date_from;
      if (date_to) whereClause.date.lte = date_to;
    }

    // Status filter
    if (status) {
      whereClause.status = status;
    }

    // Job/Shift filter
    if (job_id) {
      whereClause.job_id = job_id;
    }
    if (shift_id) {
      whereClause.shift_id = shift_id;
    }

    // If user is guard, only show their attendance
    if (req.user.role === 'guard') {
      whereClause.guard_id = req.user.id;
    }

    const totalItems = await Attendance.count({ where: whereClause });

    const attendance = await Attendance.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'guard',
          attributes: ['id', 'name', 'email']
        },
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

    return paginatedResponse(res, 'Attendance records retrieved successfully', attendance.rows, pagination);

  } catch (error) {
    console.error('Get attendance error:', error);
    return serverErrorResponse(res, 'Failed to retrieve attendance records', error);
  }
};

// Get attendance by ID
const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findByPk(id, {
      include: [
        {
          model: User,
          as: 'guard',
          attributes: ['id', 'name', 'email']
        },
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
      ]
    });

    if (!attendance) {
      return notFoundResponse(res, 'Attendance record not found');
    }

    // Check permissions
    if (req.user.role === 'guard' && attendance.guard_id !== req.user.id) {
      return errorResponse(res, 'Unauthorized to view this attendance record', 403);
    }

    return successResponse(res, 'Attendance record retrieved successfully', { attendance });

  } catch (error) {
    console.error('Get attendance by ID error:', error);
    return serverErrorResponse(res, 'Failed to retrieve attendance record', error);
  }
};

// Verify attendance (for companies/admins)
const verifyAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified, notes } = req.body;
    const verifierId = req.user.id;

    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      return notFoundResponse(res, 'Attendance record not found');
    }

    // Check if user has permission to verify this attendance
    if (req.user.role === 'guard') {
      return errorResponse(res, 'Guards cannot verify attendance', 403);
    }

    // Update attendance record
    await attendance.update({
      verified_by: verifierId,
      verified_at: new Date(),
      notes: notes || attendance.notes
    });

    return successResponse(res, 'Attendance verified successfully');

  } catch (error) {
    console.error('Verify attendance error:', error);
    return serverErrorResponse(res, 'Failed to verify attendance', error);
  }
};

module.exports = {
  checkIn,
  checkOut,
  getAttendance,
  getAttendanceById,
  verifyAttendance
};