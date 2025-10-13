# Tattler - Restaurant Directory Platform

> Transforming restaurant discovery through personalized experiences and up-to-date information

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

**Find and evaluate restaurants based on customizable criteria.**

A full-stack Node.js/MongoDB project to search, filter, and rank restaurants, with robust REST API, data import tools, and extensible schema.

---

## Features

- Search restaurants by name, cuisine, or location
- Full-text search and relevance ranking
- Pagination, filtering, and sorting (by rating or name)
- Add comments and ratings to restaurants
- Modular design for extending qualification logic or adding new data sources
- Data import from CSV with automatic generation of grades and comments
- REST API for programmatic access
- Centralized error handling and validation

---

## Tech Stack

- **Backend / API:** Node.js, Express
- **Database:** MongoDB (with schema validation & indexing)
- **Data Handling:** CSV/JSON parsers ([scripts/import-csv.js](scripts/import-csv.js))
- **Testing Tools:** Postman, Insomnia ([tests/postman](tests/postman))
- **Documentation:** Markdown ([docs/restaurant_api_docs.md](docs/restaurant_api_docs.md))

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (v7.0 or higher) OR [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Git](https://git-scm.com/)

### Installation

```sh
git clone https://github.com/ckacy01/Restaurants_Searcher_and_Qualifier.git
cd Restaurants_Searcher_and_Qualifier
npm install
```

### Configuration

Create a `.env` file and set your MongoDB URI:

```
MONGODB_URI=mongodb://localhost:27017/tatler_db
PORT=5000
```

### Running the Server

```sh
npm start
```

API will be available at `http://localhost:5000/api/restaurants`.

---

## Data Import

To import restaurant data from CSV:

```sh
node scripts/import-csv.js
```

- Source file: [scripts/resources/restaurants.csv](scripts/resources/restaurants.csv)
- Generates grades and comments automatically ([scripts/datagenerators.js](scripts/datagenerators.js))
- Handles duplicates and validation errors robustly

---

## API Usage

See [docs/restaurant_api_docs.md](docs/restaurant_api_docs.md) for full details.

**Main Endpoints:**

- `GET /api/restaurants` — List all restaurants (pagination, filtering, sorting)
- `GET /api/restaurants/:id` — Get restaurant by ID
- `GET /api/restaurants/search?q=term` — Full-text search
- `POST /api/restaurants` — Create new restaurant
- `PUT /api/restaurants/:id` — Update restaurant
- `DELETE /api/restaurants/:id` — Delete restaurant
- `POST /api/restaurants/:id/comments` — Add comment
- `POST /api/restaurants/:id/ratings` — Add rating

**Error Handling:**  
All endpoints return a `success` boolean and descriptive messages. See [src/middleware/errorHandler.js](src/middleware/errorHandler.js).

---

## Data Model

See [docs/Schemas_DB/JSONSchemafoRestaurants.txt](docs/Schemas_DB/JSONSchemafoRestaurants.txt) for full schema.

**Restaurant fields:**
- `name`, `restaurant_id`, `cuisine`, `borough`, `address`, `phone`, `website`, `price_range`
- `grades`: array of `{ date, grade, score }`
- `comments`: array of `{ _id, date, comment, user_id, rating }`
- `created_at`, `updated_at`

---

## Repository Structure

```bash
Restaurants_Searcher_and_Qualifier/
├── backups/                # Database dumps or data snapshots
├── docs/                   # Documentation, diagrams, and design files
│   ├── restaurant_api_docs.md
│   └── Schemas_DB/
│       └── JSONSchemafoRestaurants.txt
├── scripts/                # Utility or data migration scripts
│   ├── import-csv.js
│   ├── datagenerators.js
│   └── resources/
│       └── restaurants.csv
├── src/                    # Main source code
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── models/
│   └── routes/
├── tests/
│   └── postman/
├── .gitignore
├── LICENSE
└── README.md
```

---

## Documentation & Schemas

- [API Documentation](docs/restaurant_api_docs.md)
- [Restaurant Schema](docs/Schemas_DB/JSONSchemafoRestaurants.txt)
- [User Schema](docs/Schemas_DB/JSONSchemaforUsers.txt)
- [Pagination & Filtering](docs/restaurant_filtering.md)
- [Postman screenshots](tests/postman/Screenshots/)
- [Postman Testing JSON](tests/postman/Restaurant%20API%20Testing.postman_collection.json)

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

## Author

Jorge Armando Avila Carrillo | NAOID: 3310