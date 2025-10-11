const Restaurant = require('../models/Restaurant');

/**
 * Restaurant Controller - Handles CRUD operations and business logic for restaurants.
 * 
 * @author Jorge Armando Avila Carrillo | NAOID: 3310
 * @version 1.0
 * @date 10 - October - 2025
 */

/**
 * Retrieves all restaurants with pagination, filtering, and sorting options.
 * 
 * @async
 * @function getAllRestaurants
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.getAllRestaurants = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, cuisine, borough, sortBy } = req.query;

    const filter = {};
    if (cuisine) filter.cuisine = cuisine;
    if (borough) filter.borough = borough;

    const sort = {};
    if (sortBy === 'rating') sort['grades.score'] = -1;
    else if (sortBy === 'name') sort.name = 1;

    const skip = (page - 1) * limit;
    const restaurants = await Restaurant.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Restaurant.countDocuments(filter);

    res.json({
      success: true,
      data: restaurants,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_documents: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a single restaurant by ID.
 * 
 * @async
 * @function getRestaurantById
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.getRestaurantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.json({ success: true, data: restaurant });
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new restaurant with validation of required fields.
 * Auto-generates unique restaurant ID if not provided.
 * 
 * @async
 * @function createRestaurant
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.createRestaurant = async (req, res, next) => {
  try {
    const { name, borough, cuisine, address, phone, website, price_range } = req.body;

    if (!name || !borough || !cuisine || !address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, borough, cuisine, address'
      });
    }

    if (!address.street) {
      return res.status(400).json({
        success: false,
        message: 'Address must include street'
      });
    }

    const newRestaurant = new Restaurant({
      restaurant_id: `R${Date.now()}`,
      name,
      borough,
      cuisine,
      address,
      phone,
      website,
      price_range,
      grades: [],
      comments: []
    });

    await newRestaurant.save();

    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: newRestaurant
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates restaurant data by ID. Prevents modification of ID fields.
 * Updates the modification timestamp automatically.
 * 
 * @async
 * @function updateRestaurant
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.updateRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    delete updateData.restaurant_id;
    delete updateData._id;
    updateData.updated_at = new Date();

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.json({
      success: true,
      message: 'Restaurant updated successfully',
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a restaurant by ID.
 */
exports.deleteRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndDelete(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.json({
      success: true,
      message: 'Restaurant deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Adds a new comment to a restaurant.
 * Defaults to 'anonymous' if user_id is not provided.
 */
exports.addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment, user_id } = req.body;

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot be empty'
      });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            date: new Date(),
            comment,
            user_id: user_id || 'anonymous'
          }
        },
        updated_at: new Date()
      },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Adds a rating (grade) to a restaurant. Score must be between 1 and 5.
 */
exports.addRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { score } = req.body;

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      {
        $push: {
          grades: {
            date: new Date(),
            score: parseInt(score)
          }
        },
        updated_at: new Date()
      },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Rating added successfully',
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Performs text search on restaurants using MongoDB text index.
 * Results are sorted by relevance score.
 */
exports.searchRestaurants = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Missing search parameter: q'
      });
    }

    const restaurants = await Restaurant.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    res.json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};