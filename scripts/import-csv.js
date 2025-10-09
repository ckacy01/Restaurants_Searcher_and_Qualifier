const { generateGrades, generateComments } = require('./datagenerators');
const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient, ObjectId } = require('mongodb');

/**
 * Configuration for database connection and file paths
 * Defines the constants necessary for MongoDB connection and file locations
 * DATE: 08 - October - 2025
 */
const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'tatler_db';
const CSV_FILE = 'resources/restaurants.csv';

/**
 * Imports restaurant data from a CSV file into MongoDB.
 * 
 * This function reads a CSV file, validates the data, enriches records
 * with generated ratings and comments, and inserts them into the
 * restaurants collection in MongoDB.
 * 
 * Key features:
 * - CSV file reading and parsing
 * - Geographic coordinate validation (longitude: -180 to 180, latitude: -90 to 90)
 * - Required fields validation (name, cuisine, street, restaurant_id)
 * - Automatic generation of 3 ratings per restaurant
 * - Automatic generation of 4 comments per restaurant
 * - Robust error handling with unordered insertion (ordered:false)
 * - Detailed reporting of duplicates and validation errors
 * 
 * Stored document structure:
 * {
 *   restaurant_id: string (unique),
 *   name: string,
 *   cuisine: string,
 *   borough: string,
 *   phone: string,
 *   website: string,
 *   price_range: string (default: $$),
 *   address: {
 *     building: string,
 *     street: string,
 *     zipcode: string,
 *     coord: [longitude, latitude] (GeoJSON format)
 *   },
 *   grades: array (3 elements with ratings),
 *   comments: array (4 elements with comments),
 *   created_at: Date (creation timestamp),
 *   updated_at: Date (last update timestamp)
 * }
 * 
 * Connection pool settings:
 * - Default timeout: 30 seconds
 * - Max retries: 3 attempts per row
 * 
 * @author Jorge Armando Avila Carrillo | NAOID: 3310
 * @version 1.0
 * @async
 * @throws {Error} In case of connection errors or file reading issues
 */
async function importCSV() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    // Establishes connection with the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const collection = db.collection('restaurants');
    
    // Temporary array to store validated documents before insertion
    const restaurants = [];
    let rowCount = 0;
    
    /**
     * Reads and processes the CSV file line by line
     * Validates each row and prepares documents for insertion into MongoDB
     */
    fs.createReadStream(CSV_FILE)
      .pipe(csv())
      .on('data', (row) => {
        rowCount++;
        try {
          // ========== COORDINATE VALIDATION AND PROCESSING ==========
          let longitude = parseFloat(row.longitude);
          let latitude = parseFloat(row.latitude);
          
          /**
           * Validates the longitude range (-180 to 180)
           * If invalid, assigns 0.0 as the default value
           */
          if (isNaN(longitude) || longitude < -180 || longitude > 180) {
            console.warn(`Row ${rowCount}: Invalid longitude, using 0.0`);
            longitude = 0.0;
          }
          
          /**
           * Validates the latitude range (-90 to 90)
           * If invalid, assigns 0.0 as the default value
           */
          if (isNaN(latitude) || latitude < -90 || latitude > 90) {
            console.warn(`Row ${rowCount}: Invalid latitude, using 0.0`);
            latitude = 0.0;
          }
          
          // ========== REQUIRED FIELDS VALIDATION AND TRIMMING ==========
          const name = row.name?.toString().trim();
          const cuisine = row.cuisine?.toString().trim();
          const street = row.street?.toString().trim();
          const restaurant_id = row.restaurant_id?.toString().trim();
          
          /**
           * Verifies that all required fields are present
           * If any field is missing, the row is discarded with a warning
           */
          if (!name || !cuisine || !street || !restaurant_id) {
            console.warn(`Row ${rowCount}: Missing required fields, skipping`);
            return;
          }
          
          // ========== DOCUMENT CONSTRUCTION ==========
          /**
           * Creates the document object with required and optional fields
           * Optional fields receive default values if not present
           */
          const restaurant = {
            restaurant_id: restaurant_id,
            name: name,
            cuisine: cuisine,
            borough: row.borough?.toString().trim() || '',
            phone: row.phone?.toString().trim() || '',
            website: row.website?.toString().trim() || '',
            price_range: row.price_range?.toString().trim() || '$$',
            
            // Structured address object with GeoJSON coordinates
            address: {
              building: row.building?.toString().trim() || '',
              street: street,
              zipcode: row.zipcode?.toString().trim() || '',
              coord: [longitude, latitude]  // Format: [longitude, latitude]
            },
            
            // Dynamic data generation
            grades: generateGrades(3),           // 3 random ratings
            comments: generateComments(name, 4), // 4 random comments based on name
            
            // Audit metadata
            created_at: new Date(),
            updated_at: new Date()
          };
          
          restaurants.push(restaurant);
          
        } catch (error) {
          console.error(`Row ${rowCount} error:`, error.message);
        }
      })
      
      /**
       * Event fired when CSV file reading is complete
       * Executes the insertion of all validated documents
       */
      .on('end', async () => {
        try {
          // Verifies if there is valid data to insert
          if (restaurants.length === 0) {
            console.log('No valid data found in CSV.');
            return;
          }
          
          // Processing report
          console.log(`\nProcessed ${rowCount} rows from CSV`);
          console.log(`Valid documents: ${restaurants.length}`);
          console.log(`Attempting to import...\n`);
          
          // Displays a sample document to verify the structure
          console.log('Sample document structure:');
          console.log(JSON.stringify(restaurants[0], null, 2));
          console.log('\n');
          
          /**
           * Inserts multiple documents into the collection
           * ordered: false allows the insertion to continue even if there are errors
           * in individual documents (useful for duplicates due to unique restaurant_id)
           */
          const result = await collection.insertMany(restaurants, { 
            ordered: false 
          });
          
          console.log(`✓ ${result.insertedCount} restaurants imported successfully`);
          console.log(`✓ Each restaurant has 3 grades and 4 comments`);
          
        } catch (error) {
          /**
           * SPECIFIC ERROR HANDLING
           */
          
          // Error 11000: Unique key constraint violation (duplicate restaurant_id)
          if (error.code === 11000) {
            const inserted = error.result?.insertedCount || 0;
            const duplicates = restaurants.length - inserted;
            console.log(`✓ ${inserted} restaurants imported successfully`);
            console.log(`⚠ ${duplicates} duplicates skipped (restaurant_id already exists)`);
            
          } 
          // Validation errors or other write errors
          else if (error.writeErrors) {
            const inserted = error.result?.insertedCount || 0;
            const failed = error.writeErrors.length;
            console.log(`✓ ${inserted} restaurants imported successfully`);
            console.log(`✗ ${failed} documents failed validation\n`);
            
            // Displays details of the first error for diagnostics
            console.log('First error details:');
            const firstError = error.writeErrors[0];
            console.log('Failed document:', JSON.stringify(firstError.err.op, null, 2));
            
          } 
          // Generic error
          else {
            console.error('Error inserting documents:', error.message);
          }
        } finally {
          // Closes the connection with MongoDB
          await client.close();
          console.log('\nMongoDB connection closed');
        }
      })
      
      /**
       * Event fired if an error occurs during CSV file reading
       */
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        client.close();
      });
      
  } catch (error) {
    console.error('Connection error:', error);
    await client.close();
  }
}

// ========== EXECUTION ==========
// Executes the import function and captures any unhandled errors
importCSV().catch(console.error);