const { Op } = require('sequelize');

// Calculate pagination parameters
const getPaginationParams = (page = 1, limit = 10) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  
  // Ensure limits
  const maxLimit = 100;
  const minLimit = 1;
  const minPage = 1;
  
  const finalLimit = Math.min(Math.max(limitNum, minLimit), maxLimit);
  const finalPage = Math.max(pageNum, minPage);
  
  const offset = (finalPage - 1) * finalLimit;
  
  return {
    page: finalPage,
    limit: finalLimit,
    offset
  };
};

// Calculate pagination metadata
const getPaginationMeta = (totalItems, page, limit) => {
  const totalPages = Math.ceil(totalItems / limit);
  
  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

// Build search query for common fields
const buildSearchQuery = (searchTerm, searchFields = []) => {
  if (!searchTerm || searchFields.length === 0) {
    return {};
  }

  return {
    [Op.or]: searchFields.map(field => ({
      [field]: {
        [Op.iLike]: `%${searchTerm}%`
      }
    }))
  };
};

// Build date range query
const buildDateRangeQuery = (startDate, endDate, dateField = 'created_at') => {
  const query = {};
  
  if (startDate && endDate) {
    query[dateField] = {
      [Op.between]: [new Date(startDate), new Date(endDate)]
    };
  } else if (startDate) {
    query[dateField] = {
      [Op.gte]: new Date(startDate)
    };
  } else if (endDate) {
    query[dateField] = {
      [Op.lte]: new Date(endDate)
    };
  }
  
  return query;
};

// Build sorting options
const buildSortOptions = (sortBy = 'created_at', sortOrder = 'DESC') => {
  const validSortOrders = ['ASC', 'DESC'];
  const finalSortOrder = validSortOrders.includes(sortOrder.toUpperCase()) 
    ? sortOrder.toUpperCase() 
    : 'DESC';
    
  return [[sortBy, finalSortOrder]];
};

// Build filter query for status
const buildStatusFilter = (status, statusField = 'status') => {
  if (!status) return {};
  
  return {
    [statusField]: status
  };
};

// Build location-based query (for nearby searches)
const buildLocationQuery = (latitude, longitude, radius = 10) => {
  if (!latitude || !longitude) return {};
  
  // This is a simplified version - in production, you might want to use
  // PostGIS or a more sophisticated geospatial solution
  const latRange = radius / 111; // Rough conversion: 1 degree ≈ 111 km
  const lngRange = radius / (111 * Math.cos(latitude * Math.PI / 180));
  
  return {
    latitude: {
      [Op.between]: [latitude - latRange, latitude + latRange]
    },
    longitude: {
      [Op.between]: [longitude - lngRange, longitude + lngRange]
    }
  };
};

module.exports = {
  getPaginationParams,
  getPaginationMeta,
  buildSearchQuery,
  buildDateRangeQuery,
  buildSortOptions,
  buildStatusFilter,
  buildLocationQuery
};