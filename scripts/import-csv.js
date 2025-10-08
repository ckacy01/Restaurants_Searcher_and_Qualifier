const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient, ObjectId } = require('mongodb');

// Configuration
const MONGODB_URI = 'mongodb://localhost:27017'; // or your MongoDB Atlas URI
const DB_NAME = 'tatler_db';
const CSV_FILE = './restaurants.csv'; // your CSV file path

async function importCSV() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const collection = db.collection('restaurants');
    
    const restaurants = [];
    
    // Read CSV file
    fs.createReadStream(CSV_FILE)
      .pipe(csv())
      .on('data', (row) => {
        // Map CSV data to MongoDB document structure
        const restaurant = {
          restaurant_id: row.restaurant_id || `R${Date.now()}`,
          name: row.name,
          borough: row.borough || 'Unknown',
          cuisine: row.cuisine || 'General',
          address: {
            building: row.building || '',
            street: row.street || '',
            zipcode: row.zipcode || '',
            coord: row.longitude && row.latitude 
              ? [parseFloat(row.longitude), parseFloat(row.latitude)]
              : []
          },
          phone: row.phone || '',
          website: row.website || '',
          price_range: row.price_range || '$$',
          grades: [],
          comments: [],
          created_at: new Date(),
          updated_at: new Date()
        };
        
        restaurants.push(restaurant);
      })
      .on('end', async () => {
        try {
          const result = await collection.insertMany(restaurants);
          console.log(`${result.insertedCount} restaurants imported successfully`);
        } catch (error) {
          console.error('Error inserting documents:', error);
        } finally {
          await client.close();
        }
      });
      
  } catch (error) {
    console.error('Connection error:', error);
    await client.close();
  }
}

importCSV();
