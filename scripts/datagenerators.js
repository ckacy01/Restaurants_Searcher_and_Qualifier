const { ObjectId } = require('mongodb');

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

function generateComments(restaurantName, count = 4) {
  const comments = [];
  const commentTemplates = [
    "Amazing food! Best {cuisine} in the city.",
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