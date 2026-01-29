// Pagination Utility for Phase 2.1
// Handles pagination parameter validation and response formatting

/**
 * Get pagination parameters from query string
 * Validates page and limit values with security constraints
 * @param {Object} query - Express query object
 * @returns {Object} {page, limit, skip}
 */
const getPaginationParams = (query) => {
  let page = parseInt(query.page) || 1;
  let limit = parseInt(query.limit) || 10;

  // Validation: page must be >= 1
  if (page < 1) page = 1;

  // Validation: limit between 1 and 50 (security constraint)
  if (limit < 1) limit = 1;
  if (limit > 50) limit = 50;

  // Calculate skip for MongoDB
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Format paginated response for consistency
 * @param {Object} params - Parameters object
 * @param {Array} params.docs - Array of documents
 * @param {Number} params.totalDocs - Total document count
 * @param {Number} params.page - Current page number
 * @param {Number} params.limit - Items per page
 * @returns {Object} Formatted pagination response
 */
const formatPaginatedResponse = ({ docs, totalDocs, page, limit }) => {
  const totalPages = Math.ceil(totalDocs / limit);

  return {
    data: docs,
    pagination: {
      totalItems: totalDocs,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

module.exports = {
  getPaginationParams,
  formatPaginatedResponse
};
