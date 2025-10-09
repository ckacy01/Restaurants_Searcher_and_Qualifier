# Tattler - Restaurant Directory Platform

> Transforming restaurant discovery through personalized experiences and up-to-date information

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

**Find and evaluate restaurants based on customizable criteria.**

A project designed to help users search for restaurants, filter them using multiple conditions, and rank or qualify them according to specific rules or preferences.

---

## Features

- Search restaurants by name, cuisine, or location  
- Rank and qualify restaurants based on user-defined metrics  
- Modular design for extending qualification logic or adding new data sources  
- Data parsing from CSV/JSON formats  
- REST API for programmatic access  

---

## Tech Stack

- **Backend / API:** Node.js, Express  
- **Database:** MongoDB (with schema validation & indexing)  
- **Data Handling:** CSV/JSON parsers  
- **Version Control:** Git / GitHub  
- **Testing Tools:** Postman, Insomnia  
- **Documentation:** Markdown  

---

## Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (v7.0 or higher) OR [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- [Git](https://git-scm.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ckacy01/Restaurants_Searcher_and_Qualifier.git
cd Restaurants_Searcher_and_Qualifier

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Example: create a .env file and add your MongoDB URI
# MONGO_URI=mongodb://localhost:27017/restaurants_db

# 4. Run the server
npm start

```
### Repository Structure

```bash
Restaurants_Searcher_and_Qualifier/
├── backups/                # Database dumps or data snapshots
├── docs/                   # Documentation, diagrams, and design files
├── scripts/                # Utility or data migration scripts
├── src/                    # Main source code
│   ├── controllers/        # API request handlers
│   ├── models/             # Mongoose schemas and data models
│   ├── routes/             # Express route definitions
│   └── services/           # Business logic and qualification algorithms
├── .gitignore              
├── LICENSE                 
└── README.md
```

**Folder summary:**

- **backups/** → Backup data and exports

- **docs/** → Project specs, ER diagrams, API documentation

- **scripts/** → Automation, data import/export tools

- **src/** → Core app logic (controllers, routes, services, models)


