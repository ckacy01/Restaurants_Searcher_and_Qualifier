const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'tatler_db';
const CSV_FILE = 'resources/restaurants.csv';

async function importCSV() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection('restaurants');

    const restaurants = [];

    fs.createReadStream(CSV_FILE)
      .pipe(csv())
      .on('data', (row) => {
        // Ensure required fields exist and are valid strings
        const restaurant = {
          restaurant_id: row.restaurant_id?.toString() || `R${Date.now()}`,
          name: row.name?.toString() || 'Unnamed Restaurant',
          borough: row.borough?.toString() || 'Unknown',
          cuisine: row.cuisine?.toString() || 'General',
          address: {
            building: row.building?.toString() || '',
            street: row.street?.toString() || 'Unknown Street',
            zipcode: row.zipcode?.toString() || '',
            coord:
              row.longitude && row.latitude
                ? [parseFloat(row.longitude), parseFloat(row.latitude)]
                : [0, 0]
          },
          phone: row.phone?.toString() || '',
          website: row.website?.toString() || '',
          price_range: row.price_range?.toString() || '$$',
          grades: [],
          comments: [],
          created_at: new Date(),
          updated_at: new Date()
        };

        restaurants.push(restaurant);
      })
      .on('end', async () => {
        try {
          if (restaurants.length === 0) {
            console.log('No data found in CSV.');
          } else {
            const result = await collection.insertMany(restaurants);
            console.log(`${result.insertedCount} restaurants imported successfully`);
          }
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
