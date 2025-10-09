const { ObjectId } = require('mongodb');

/**
 * Data generation module for restaurant ratings and user comments.
 * 
 * Provides utilities to generate realistic mock data for restaurant grading
 * systems and user reviews during data import operations.
 * 
 * DATE: 08 - October - 2025
 * @author Jorge Armando Avila Carrillo | NAOID: 3310
 * @version 1.0
 */

/**
 * Generates an array of random restaurant grades with associated metadata.
 * 
 * Creates realistic grade records spanning up to one year of historical data.
 * Each grade includes a letter grade (A, B, or C), a numeric score, and a timestamp.
 * Grades are distributed across different time periods to simulate inspections over time.
 * 
 * Grading system:
 * - Grade A: Score range 90-99
 * - Grade B: Score range 80-89
 * - Grade C: Score range 70-79
 * 
 * @param {number} [count=3] - Number of grades to generate
 * @returns {Array} Array of grade objects: { date, grade, score }
 */
function generateGrades(count = 3) {
  const grades = [];
  const letterGrades = ['A', 'B', 'C'];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 365) + (i * 120);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    
    const score = Math.floor(Math.random() * 30) + (letterGrades.indexOf(letterGrades[i % 3]) * 10);
    
    grades.push({
      date: date,
      grade: letterGrades[Math.floor(Math.random() * letterGrades.length)],
      score: score
    });
  }
  
  return grades;
}

/**
 * Generates an array of random user comments for a restaurant.
 * 
 * Creates realistic user reviews with varied content, ratings, and timestamps.
 * Comments are generated from predefined templates with placeholder replacement
 * and assigned to random users with ratings between 4-5.
 * 
 * Available templates placeholders: {dish}
 * Available dishes: pasta, sushi, steak, pizza, tacos, salad, dessert, appetizers
 * Available users: user001-user008
 * 
 * @param {string} restaurantName - Name of the restaurant
 * @param {number} [count=4] - Number of comments to generate
 * @returns {Array} Array of comment objects: { _id, date, comment, user_id, rating }
 */
function generateComments(restaurantName, count = 4) {
  const comments = [];
  
  const commentTemplates = [
    "Amazing food! Best {dish} in the city.",
    "Great atmosphere and excellent service.",
    "The {dish} was outstanding!",
    "Highly recommend this place for a special occasion.",
    "Good food but a bit pricey.",
    "Love coming here, never disappoints!",
    "The staff was very friendly and accommodating.",
    "Perfect spot for a date night.",
    "Delicious food, will definitely return!",
    "One of my favorite restaurants in the area."
  ];
  
  const dishes = ["pasta", "sushi", "steak", "pizza", "tacos", "salad", "dessert", "appetizers"];
  const userIds = ["user001", "user002", "user003", "user004", "user005", "user006", "user007", "user008"];
  
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    
    let commentText = commentTemplates[Math.floor(Math.random() * commentTemplates.length)];
    commentText = commentText.replace('{dish}', dishes[Math.floor(Math.random() * dishes.length)]);
    
    comments.push({
      _id: new ObjectId(),
      date: date,
      comment: commentText,
      user_id: userIds[Math.floor(Math.random() * userIds.length)],
      rating: Math.floor(Math.random() * 2) + 4
    });
  }
  
  return comments;
}

module.exports = {
  generateGrades,
  generateComments
};