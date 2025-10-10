const mongoose = require('mongoose');
const { Schema } = mongoose;


const CommentSchema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  date: { type: Date, required: true, description: 'Comment date' },
  comment: { type: String, required: true, description: 'Comment text' },
  user_id: { type: String, description: 'User who made the comment' },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    description: 'Star rating 1–5'
  }
}, { _id: false });


const GradeSchema = new Schema({
  date: { type: Date, required: true, description: 'Inspection date' },
  grade: { type: String, description: 'Letter grade (A, B, C, etc.)' },
  score: { type: Number, required: true, description: 'Numeric score' }
}, { _id: false });

const AddressSchema = new Schema({
  building: { type: String, description: 'Building number' },
  street: { type: String, required: true, description: 'Street name' },
  zipcode: { type: String, description: 'ZIP code' },
  coord: {
    type: [Number],
    validate: {
      validator: (v) => v.length === 2,
      message: 'coord must have [longitude, latitude]'
    },
    description: 'Coordinates [longitude, latitude]'
  }
}, { _id: false });


const RestaurantSchema = new Schema({
  name: { type: String, required: true, description: 'Restaurant name' },
  restaurant_id: {
    type: String,
    required: true,
    unique: true,
    description: 'Unique restaurant ID'
  },
  cuisine: { type: String, required: true, description: 'Cuisine type' },
  borough: { type: String, description: 'Borough name (optional)' },
  phone: { type: String, description: 'Phone number (optional)' },
  website: { type: String, description: 'Website URL (optional)' },
  price_range: { type: String, description: 'Price range $, $$, $$$' },
  address: { type: AddressSchema, required: true },
  grades: { type: [GradeSchema], description: 'Restaurant grades/inspections' },
  comments: { type: [CommentSchema], description: 'User comments/reviews' },
  created_at: { type: Date, description: 'Document creation timestamp' },
  updated_at: { type: Date, description: 'Last update timestamp' }
}, {
  timestamps: false,
  versionKey: false
});

RestaurantSchema.index({ 'address.coord': '2dsphere' });
RestaurantSchema.index({ name: 'text' }); // texto para búsqueda
RestaurantSchema.index({ cuisine: 1 });
RestaurantSchema.index({ borough: 1 });


module.exports = mongoose.model('Restaurant', RestaurantSchema);
