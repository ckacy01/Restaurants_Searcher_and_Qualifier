const express = require('express');
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  addComment,
  addRating,
  searchRestaurants
} = require('../controller/restaurantController');

/**
 * Restaurant Routes Module - Defines all API endpoints for restaurant operations.
 * 
 * @author Jorge Armando Avila Carrillo | NAOID: 3310
 * @version 1.0
 * @date 04 - October - 2025
 */

/**
 * GET / - Retrieves all restaurants with pagination, filtering, and sorting.
 * 
 * @route GET /
 * @function getAllRestaurants
 * @returns {Promise<void>}
 */
router.get('/', getAllRestaurants);

/**
 * GET /search - Performs text search on restaurants.
 * 
 * @route GET /search
 * @function searchRestaurants
 * @returns {Promise<void>}
 */
router.get('/search', searchRestaurants);

/**
 * GET /:id - Retrieves a single restaurant by ID.
 * 
 * @route GET /:id
 * @param {string} id - Restaurant ID
 * @function getRestaurantById
 * @returns {Promise<void>}
 */
router.get('/:id', getRestaurantById);

/**
 * POST / - Creates a new restaurant.
 * 
 * @route POST /
 * @function createRestaurant
 * @returns {Promise<void>}
 */
router.post('/', createRestaurant);

/**
 * POST /:id/comments - Adds a comment to a restaurant.
 * 
 * @route POST /:id/comments
 * @param {string} id - Restaurant ID
 * @function addComment
 * @returns {Promise<void>}
 */
router.post('/:id/comments', addComment);

/**
 * POST /:id/ratings - Adds a rating to a restaurant.
 * 
 * @route POST /:id/ratings
 * @param {string} id - Restaurant ID
 * @function addRating
 * @returns {Promise<void>}
 */
router.post('/:id/ratings', addRating);

/**
 * PUT /:id - Updates a restaurant by ID.
 * 
 * @route PUT /:id
 * @param {string} id - Restaurant ID
 * @function updateRestaurant
 * @returns {Promise<void>}
 */
router.put('/:id', updateRestaurant);

/**
 * DELETE /:id - Deletes a restaurant by ID.
 * 
 * @route DELETE /:id
 * @param {string} id - Restaurant ID
 * @function deleteRestaurant
 * @returns {Promise<void>}
 */
router.delete('/:id', deleteRestaurant);

module.exports = router;