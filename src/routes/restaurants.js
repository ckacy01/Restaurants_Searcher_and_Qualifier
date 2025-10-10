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

// GET
router.get('/', getAllRestaurants);
router.get('/search', searchRestaurants);
router.get('/:id', getRestaurantById);

// POST
router.post('/', createRestaurant);
router.post('/:id/comments', addComment);
router.post('/:id/ratings', addRating);

// PUT
router.put('/:id', updateRestaurant);

// DELETE
router.delete('/:id', deleteRestaurant);

module.exports = router;