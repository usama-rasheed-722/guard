const { Attendance, Job, Shift, User, ShiftAssignment, JobAssignment, AttendanceAlarm, AttendancePing } = require('../models');
const { successResponse, errorResponse, serverErrorResponse, notFoundResponse, paginatedResponse } = require('../helpers/response');
const { getPaginationParams, getPaginationMeta, buildSortOptions } = require('../helpers/pagination');
const { Op } = require('sequelize');
const moment = require('moment');

// Guard: list my attendance for a specific job
const getMyAttendanceForJob = async (req, res) => {
  try {
    const guardId = req.user.id;
    const { job_id } = req.params;
    const { page = 1, limit = 10, date_from, date_to, sort_by = 'date', sort_order = 'DESC' } = req.query;

    const { page: finalPage, limit: finalLimit, offset } = getPaginationParams(page, limit);

    const whereClause = { guard_id: guardId, job_id };
    if (date_from || date_to) {
      whereClause.date = {};
      if (date_from) whereClause.date.gte = date_from;
      if (date_to) whereClause.date.lte = date_to;
    }

    const totalItems = await Attendance.count({ where: whereClause });
    const records = await Attendance.findAndCountAll({
      where: whereClause,
      include: [
        { model: Job, as: 'job', required: false },
        { model: Shift, as: 'shift', required: false }
      ],
      order: buildSortOptions(sort_by, sort_order),
      limit: finalLimit,
      offset
    });

    const pagination = getPaginationMeta(totalItems, finalPage, finalLimit);
    return paginatedResponse(res, 'Guard job attendance retrieved successfully', records.rows, pagination);
  } catch (error) {
    console.error('Get my attendance for job error:', error);
    return serverErrorResponse(res, 'Failed to retrieve attendance', error);
  }
};

// Guard: list my attendance for a specific shift
const getMyAttendanceForShift = async (req, res) => {
  try {
    const guardId = req.user.id;
    const { shift_id } = req.params;
    const { page = 1, limit = 10, date_from, date_to, sort_by = 'date', sort_order = 'DESC' } = req.query;

    const { page: finalPage, limit: finalLimit, offset } = getPaginationParams(page, limit);

    const whereClause = { guard_id: guardId, shift_id };
    if (date_from || date_to) {
      whereClause.date = {};
      if (date_from) whereClause.date.gte = date_from;
      if (date_to) whereClause.date.lte = date_to;
    }

    const totalItems = await Attendance.count({ where: whereClause });
    const records = await Attendance.findAndCountAll({
      where: whereClause,
      include: [
        { model: Job, as: 'job', required: false },
        { model: Shift, as: 'shift', required: false }
      ],
      order: buildSortOptions(sort_by, sort_order),
      limit: finalLimit,
      offset
    });

    const pagination = getPaginationMeta(totalItems, finalPage, finalLimit);
    return paginatedResponse(res, 'Guard shift attendance retrieved successfully', records.rows, pagination);
  } catch (error) {
    console.error('Get my attendance for shift error:', error);
    return serverErrorResponse(res, 'Failed to retrieve attendance', error);
  }
};

// Guard: attendance detail by job/shift and date (includes pings and alarm)
const getMyAttendanceDetail = async (req, res) => {
  try {
    const guardId = req.user.id;
    const { job_id, shift_id, date } = req.query;

    if ((!job_id && !shift_id) || (job_id && shift_id)) {
      return errorResponse(res, 'Provide either job_id or shift_id (not both)', 400);
    }
    if (!date) return errorResponse(res, 'date is required (YYYY-MM-DD)', 400);

    const attendance = await Attendance.findOne({
      where: {
        guard_id: guardId,
        date,
        ...(job_id ? { job_id } : { shift_id })
      },
      include: [
        { model: Job, as: 'job', required: false },
        { model: Shift, as: 'shift', required: false }
      ]
    });

    if (!attendance) return notFoundResponse(res, 'Attendance record not found for the specified date');

    const startOfDay = moment(date).startOf('day').toDate();
    const endOfDay = moment(date).endOf('day').toDate();

    const pingWhere = { guard_id: guardId, pinged_at: { [Op.between]: [startOfDay, endOfDay] } };
    if (job_id) pingWhere.job_id = job_id; else pingWhere.shift_id = shift_id;

    const pings = await AttendancePing.findAll({ where: pingWhere, order: [['pinged_at', 'ASC']] });

    const alarm = await AttendanceAlarm.findOne({
      where: { active: true, ...(job_id ? { job_id } : { shift_id }) },
      order: [['updated_at', 'DESC']]
    });

    return successResponse(res, 'Guard attendance detail retrieved successfully', { attendance, pings, alarm });
  } catch (error) {
    console.error('Get my attendance detail error:', error);
    return serverErrorResponse(res, 'Failed to retrieve attendance detail', error);
  }
};

// Agency: list attendance for jobs/shifts they own
const getAgencyAttendance = async (req, res) => {
  try {
    const companyId = req.user.id;
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

    const whereClause = {};
    if (status) whereClause.status = status;
    if (job_id) whereClause.job_id = job_id;
    if (shift_id) whereClause.shift_id = shift_id;
    if (date_from || date_to) {
      whereClause.date = {};
      if (date_from) whereClause.date.gte = date_from;
      if (date_to) whereClause.date.lte = date_to;
    }

    // Scope by agency ownership via virtual paths
    const ownershipScope = {
      [Op.or]: [
        { '$job.company_id$': companyId },
        { '$shift.company_id$': companyId }
      ]
    };

    const totalItems = await Attendance.count({
      where: { ...whereClause, ...ownershipScope },
      include: [
        { model: Job, as: 'job', required: false },
        { model: Shift, as: 'shift', required: false }
      ]
    });

    const attendance = await Attendance.findAndCountAll({
      where: { ...whereClause, ...ownershipScope },
      include: [
        { model: User, as: 'guard', attributes: ['id', 'name', 'email'] },
        {
          model: Job,
          as: 'job',
          required: false,
          include: [{ model: User, as: 'company', attributes: ['id', 'name', 'email'] }]
        },
        {
          model: Shift,
          as: 'shift',
          required: false,
          include: [{ model: User, as: 'company', attributes: ['id', 'name', 'email'] }]
        }
      ],
      order: buildSortOptions(sort_by, sort_order),
      limit: finalLimit,
      offset
    });

    const pagination = getPaginationMeta(totalItems, finalPage, finalLimit);
    return paginatedResponse(res, 'Agency attendance retrieved successfully', attendance.rows, pagination);
  } catch (error) {
    console.error('Get agency attendance error:', error);
    return serverErrorResponse(res, 'Failed to retrieve agency attendance', error);
  }
};

// Attendance details including pings and active alarm for the day
const getAttendanceDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const requester = req.user;

    const attendance = await Attendance.findByPk(id, {
      include: [
        { model: User, as: 'guard', attributes: ['id', 'name', 'email'] },
        { model: Job, as: 'job', required: false },
        { model: Shift, as: 'shift', required: false }
      ]
    });

    if (!attendance) return notFoundResponse(res, 'Attendance record not found');

    // Authorization: guard who owns, or agency owning the job/shift
    if (requester.role === 'guard' && attendance.guard_id !== requester.id) {
      return errorResponse(res, 'Unauthorized', 403);
    }
    if (requester.role === 'agency') {
      const ownsJob = attendance.job && attendance.job.company_id === requester.id;
      const ownsShift = attendance.shift && attendance.shift.company_id === requester.id;
      if (!ownsJob && !ownsShift) return errorResponse(res, 'Unauthorized', 403);
    }

    const startOfDay = moment(attendance.date).startOf('day').toDate();
    const endOfDay = moment(attendance.date).endOf('day').toDate();

    // Fetch pings for same guard and same job/shift within the attendance day
    const pingWhere = {
      guard_id: attendance.guard_id,
      pinged_at: { [Op.between]: [startOfDay, endOfDay] }
    };
    if (attendance.job_id) pingWhere.job_id = attendance.job_id; else pingWhere.shift_id = attendance.shift_id;

    const pings = await AttendancePing.findAll({
      where: pingWhere,
      order: [['pinged_at', 'ASC']]
    });

    // Fetch active alarm for the job/shift (latest by updated_at)
    const alarm = await AttendanceAlarm.findOne({
      where: {
        active: true,
        ...(attendance.job_id ? { job_id: attendance.job_id } : { shift_id: attendance.shift_id })
      },
      order: [['updated_at', 'DESC']]
    });

    return successResponse(res, 'Attendance detail retrieved successfully', {
      attendance,
      pings,
      alarm
    });
  } catch (error) {
    console.error('Get attendance detail error:', error);
    return serverErrorResponse(res, 'Failed to retrieve attendance detail', error);
  }
};

// Create or update an attendance alarm (company/admin)
const setAttendanceAlarm = async (req, res) => {
  try {
    const companyId = req.user.id;
    const { job_id, shift_id, interval_minutes, active = true } = req.body;

    if ((!job_id && !shift_id) || (job_id && shift_id)) {
      return errorResponse(res, 'Provide either job_id or shift_id (not both)', 400);
    }
    if (!interval_minutes || interval_minutes <= 0) {
      return errorResponse(res, 'interval_minutes must be > 0', 400);
    }

    // Basic ownership checks
    if (job_id) {
      const job = await Job.findByPk(job_id);
      if (!job) return notFoundResponse(res, 'Job not found');
      if (job.company_id !== companyId) return errorResponse(res, 'Unauthorized', 403);
    }
    if (shift_id) {
      const shift = await Shift.findByPk(shift_id);
      if (!shift) return notFoundResponse(res, 'Shift not found');
      if (shift.company_id !== companyId) return errorResponse(res, 'Unauthorized', 403);
    }

    let alarm = await AttendanceAlarm.findOne({ where: { job_id: job_id || null, shift_id: shift_id || null } });
    if (alarm) {
      await alarm.update({ interval_minutes, active, updated_by: companyId });
    } else {
      alarm = await AttendanceAlarm.create({ job_id: job_id || null, shift_id: shift_id || null, interval_minutes, active, created_by: companyId });
    }

    return successResponse(res, 'Attendance alarm saved', { alarm });
  } catch (error) {
    console.error('Set attendance alarm error:', error);
    return serverErrorResponse(res, 'Failed to set attendance alarm', error);
  }
};

// Guard submits a periodic attendance ping with location
const pingAttendance = async (req, res) => {
  try {
    const guardId = req.user.id;
    const { job_id, shift_id, latitude, longitude } = req.body;

    if ((!job_id && !shift_id) || (job_id && shift_id)) {
      return errorResponse(res, 'Provide either job_id or shift_id (not both)', 400);
    }
    if (latitude == null || longitude == null) {
      return errorResponse(res, 'latitude and longitude are required', 400);
    }

    // Ensure assignment
    if (job_id) {
      const jobAssignment = await JobAssignment.findOne({ where: { job_id, guard_id: guardId } });
      if (!jobAssignment) return errorResponse(res, 'You are not assigned to this job', 403);
    } else if (shift_id) {
      const shiftAssignment = await ShiftAssignment.findOne({ where: { shift_id, guard_id: guardId } });
      if (!shiftAssignment) return errorResponse(res, 'You are not assigned to this shift', 403);
    }

    const ping = await AttendancePing.create({
      guard_id: guardId,
      job_id: job_id || null,
      shift_id: shift_id || null,
      latitude,
      longitude
    });

    return successResponse(res, 'Attendance ping saved', { ping });
  } catch (error) {
    console.error('Ping attendance error:', error);
    return serverErrorResponse(res, 'Failed to save attendance ping', error);
  }
};

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
      if (!job) return notFoundResponse(res, 'Job not found');
      // Ensure guard has a job assignment
      const jobAssignment = await JobAssignment.findOne({ where: { job_id, guard_id: guardId } });
      if (!jobAssignment) return errorResponse(res, 'You are not assigned to this job', 403);
    } else if (shift_id) {
      const shift = await Shift.findByPk(shift_id);
      if (!shift) {
        return notFoundResponse(res, 'Shift not found');
      }
      
      // Check if guard is assigned to this shift through ShiftAssignment
      const assignment = await ShiftAssignment.findOne({
        where: {
          shift_id: shift_id,
          guard_id: guardId,
          status: { [Op.in]: ['accepted', 'active', 'completed'] }
        }
      });
      
      if (!assignment) {
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
  verifyAttendance,
  setAttendanceAlarm,
  pingAttendance,
  getAgencyAttendance,
  getAttendanceDetail,
  getMyAttendanceForJob,
  getMyAttendanceForShift,
  getMyAttendanceDetail
};