const Restaurant = require('../models/Restaurant');

// Get all restaurants with pagination, filtering, and sorting
exports.getAllRestaurants = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, cuisine, borough, sortBy } = req.query;

    // Build filter
    const filter = {};
    if (cuisine) filter.cuisine = cuisine;
    if (borough) filter.borough = borough;

    // Build sorting
    const sort = {};
    if (sortBy === 'rating') {
      sort['grades.score'] = -1;
    } else if (sortBy === 'name') {
      sort.name = 1;
    }

    // Pagination skip
    const skip = (page - 1) * limit;

    // Execute query
    const restaurants = await Restaurant.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    // Count total documents
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

// Get restaurant by ID
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

    res.json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

// Create new restaurant
exports.createRestaurant = async (req, res, next) => {
  try {
    const { name, borough, cuisine, address, phone, website, price_range } = req.body;

    // Validate required fields
    if (!name || !borough || !cuisine || !address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, borough, cuisine, address'
      });
    }

    // Validate address
    if (!address.street) {
      return res.status(400).json({
        success: false,
        message: 'Address must include street'
      });
    }

    // Generate unique restaurant ID if missing
    const restaurant_id = `R${Date.now()}`;

    const newRestaurant = new Restaurant({
      restaurant_id,
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

// Update restaurant
exports.updateRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Prevent changing the ID
    delete updateData.restaurant_id;
    delete updateData._id;

    // Update modification date
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

// Delete restaurant
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

// Add a comment
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

// Add a rating
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

// Text search
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
