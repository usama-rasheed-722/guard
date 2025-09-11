const { CompanyLocation } = require('../models');
const { successResponse, errorResponse, serverErrorResponse, notFoundResponse, paginatedResponse } = require('../helpers/response');

// Create location
const createLocation = async (req, res) => {
  try {
    const companyId = req.user.id;
    const payload = { ...req.body, company_id: companyId };
    const location = await CompanyLocation.create(payload);
    return successResponse(res, 'Location created successfully', { location }, 201);
  } catch (error) {
    console.error('Create company location error:', error);
    return serverErrorResponse(res, 'Failed to create location', error);
  }
};

// List own locations (no pagination for simplicity; can add later)
const listLocations = async (req, res) => {
  try {
    const companyId = req.user.id;
    const locations = await CompanyLocation.findAll({ where: { company_id: companyId } });
    return successResponse(res, 'Locations retrieved successfully', { locations });
  } catch (error) {
    console.error('List company locations error:', error);
    return serverErrorResponse(res, 'Failed to retrieve locations', error);
  }
};

// Get single location
const getLocation = async (req, res) => {
  try {
    const companyId = req.user.id;
    const { id } = req.params;
    const location = await CompanyLocation.findOne({ where: { id, company_id: companyId } });
    if (!location) return notFoundResponse(res, 'Location not found');
    return successResponse(res, 'Location retrieved successfully', { location });
  } catch (error) {
    console.error('Get company location error:', error);
    return serverErrorResponse(res, 'Failed to retrieve location', error);
  }
};

// Update location
const updateLocation = async (req, res) => {
  try {
    const companyId = req.user.id;
    const { id } = req.params;
    const location = await CompanyLocation.findOne({ where: { id, company_id: companyId } });
    if (!location) return notFoundResponse(res, 'Location not found');
    await location.update(req.body);
    return successResponse(res, 'Location updated successfully', { location });
  } catch (error) {
    console.error('Update company location error:', error);
    return serverErrorResponse(res, 'Failed to update location', error);
  }
};

// Delete location
const deleteLocation = async (req, res) => {
  try {
    const companyId = req.user.id;
    const { id } = req.params;
    const location = await CompanyLocation.findOne({ where: { id, company_id: companyId } });
    if (!location) return notFoundResponse(res, 'Location not found');
    await location.destroy();
    return successResponse(res, 'Location deleted successfully');
  } catch (error) {
    console.error('Delete company location error:', error);
    return serverErrorResponse(res, 'Failed to delete location', error);
  }
};

module.exports = {
  createLocation,
  listLocations,
  getLocation,
  updateLocation,
  deleteLocation
};

