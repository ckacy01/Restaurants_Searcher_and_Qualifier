const { generateGrades, generateComments } = require('./datagenerators');
const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient, ObjectId } = require('mongodb');

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
    let rowCount = 0;
    
    fs.createReadStream(CSV_FILE)
      .pipe(csv())
      .on('data', (row) => {
        rowCount++;
        try {
          // Parse coordinates
          let longitude = parseFloat(row.longitude);
          let latitude = parseFloat(row.latitude);
          
          // Validate coordinate ranges
          if (isNaN(longitude) || longitude < -180 || longitude > 180) {
            console.warn(`Row ${rowCount}: Invalid longitude, using 0.0`);
            longitude = 0.0;
          }
          if (isNaN(latitude) || latitude < -90 || latitude > 90) {
            console.warn(`Row ${rowCount}: Invalid latitude, using 0.0`);
            latitude = 0.0;
          }
          
          // Validate required fields
          const name = row.name?.toString().trim();
          const cuisine = row.cuisine?.toString().trim();
          const street = row.street?.toString().trim();
          const restaurant_id = row.restaurant_id?.toString().trim();
          
          if (!name || !cuisine || !street || !restaurant_id) {
            console.warn(`Row ${rowCount}: Missing required fields, skipping`);
            return;
          }
          
          // Build document with all optional fields
          const restaurant = {
            restaurant_id: restaurant_id,
            name: name,
            cuisine: cuisine,
            borough: row.borough?.toString().trim() || '',
            phone: row.phone?.toString().trim() || '',
            website: row.website?.toString().trim() || '',
            price_range: row.price_range?.toString().trim() || '$$',
            address: {
              building: row.building?.toString().trim() || '',
              street: street,
              zipcode: row.zipcode?.toString().trim() || '',
              coord: [longitude, latitude]
            },
            grades: generateGrades(3),           // Generate 3 random grades
            comments: generateComments(name, 4), // Generate 4 random comments
            created_at: new Date(),
            updated_at: new Date()
          };
          
          restaurants.push(restaurant);
          
        } catch (error) {
          console.error(`Row ${rowCount} error:`, error.message);
        }
      })
      .on('end', async () => {
        try {
          if (restaurants.length === 0) {
            console.log('No valid data found in CSV.');
            return;
          }
          
          console.log(`\nProcessed ${rowCount} rows from CSV`);
          console.log(`Valid documents: ${restaurants.length}`);
          console.log(`Attempting to import...\n`);
          
          // Sample document for verification
          console.log('Sample document structure:');
          console.log(JSON.stringify(restaurants[0], null, 2));
          console.log('\n');
          
          // Insert with ordered:false to continue on errors
          const result = await collection.insertMany(restaurants, { 
            ordered: false 
          });
          
          console.log(`✓ ${result.insertedCount} restaurants imported successfully`);
          console.log(`✓ Each restaurant has 3 grades and 4 comments`);
          
        } catch (error) {
          if (error.code === 11000) {
            // Duplicate key errors
            const inserted = error.result?.insertedCount || 0;
            const duplicates = restaurants.length - inserted;
            console.log(`✓ ${inserted} restaurants imported successfully`);
            console.log(`⚠ ${duplicates} duplicates skipped (restaurant_id already exists)`);
          } else if (error.writeErrors) {
            // Validation or other write errors
            const inserted = error.result?.insertedCount || 0;
            const failed = error.writeErrors.length;
            console.log(`✓ ${inserted} restaurants imported successfully`);
            console.log(`✗ ${failed} documents failed validation\n`);
            
            // Show first error in detail
            console.log('First error details:');
            const firstError = error.writeErrors[0];
            console.log('Failed document:', JSON.stringify(firstError.err.op, null, 2));
            
          } else {
            console.error('Error inserting documents:', error.message);
          }
        } finally {
          await client.close();
          console.log('\nMongoDB connection closed');
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        client.close();
      });
      
  } catch (error) {
    console.error('Connection error:', error);
    await client.close();
  }
}

// Run the import
importCSV().catch(console.error);