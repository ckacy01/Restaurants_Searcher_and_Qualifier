# Restaurant API Documentation

## Base URL
```
http://localhost:5000/api/restaurants
```

---

## GET Requests

### 1. Get All Restaurants
**Endpoint:** `GET /`

**Description:** Retrieves all restaurants with pagination, filtering, and sorting options.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Results per page (default: 10) |
| cuisine | string | No | Filter by cuisine type |
| borough | string | No | Filter by borough |
| sortBy | string | No | Sort by 'rating' or 'name' |

**Example Request:**
```
GET /api/restaurants?page=1&limit=10&cuisine=Italian&borough=Greenwich Village
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_documents": 50,
    "limit": 10
  }
}
```

---

### 2. Get Restaurant by ID
**Endpoint:** `GET /:id`

**Description:** Retrieves a single restaurant by its MongoDB ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | MongoDB restaurant ID |

**Example Request:**
```
GET /api/restaurants/68e6c32ba2c202ff4c99d7f8
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "68e6c32ba2c202ff4c99d7f8",
    "name": "Test Restaurant",
    "cuisine": "Italian",
    "borough": "Manhattan",
    "address": {...},
    "phone": "123-456-7890",
    "website": "http://testrestaurant.com",
    "price_range": "$$",
    "grades": [],
    "comments": []
  }
}
```

---

### 3. Search Restaurants by Text
**Endpoint:** `GET /search`

**Description:** Performs full-text search on restaurants. Results are sorted by relevance score.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | Search query term |

**Example Request:**
```
GET /api/restaurants/search?q=Pizza
```

**Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [...]
}
```

---

## POST Requests

### 4. Create New Restaurant
**Endpoint:** `POST /`

**Description:** Creates a new restaurant. Validates required fields and auto-generates restaurant ID.

**Request Body:**
```json
{
  "name": "Test Restaurant",
  "cuisine": "Italian",
  "borough": "Manhattan",
  "address": {
    "street": "123 Main St",
    "zipcode": "10001",
    "coord": [-73.987, 40.748]
  },
  "phone": "123-456-7890",
  "website": "http://testrestaurant.com",
  "price_range": "$$"
}
```

**Required Fields:** name, borough, cuisine, address (with street)

**Response:**
```json
{
  "success": true,
  "message": "Restaurant created successfully",
  "data": {...}
}
```

**Status Code:** 201 Created

---

### 5. Add Comment to Restaurant
**Endpoint:** `POST /:id/comments`

**Description:** Adds a comment to a restaurant. Defaults to 'anonymous' if user_id is not provided.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Restaurant ID |

**Request Body:**
```json
{
  "comment": "Great food and ambiance!",
  "user_id": "user123"
}
```

**Required Fields:** comment

**Response:**
```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {...}
}
```

**Status Code:** 201 Created

---

### 6. Add Rating to Restaurant
**Endpoint:** `POST /:id/ratings`

**Description:** Adds a rating (grade) to a restaurant. Score must be between 1 and 5.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Restaurant ID |

**Request Body:**
```json
{
  "score": 4
}
```

**Required Fields:** score (1-5)

**Response:**
```json
{
  "success": true,
  "message": "Rating added successfully",
  "data": {...}
}
```

**Status Code:** 201 Created

---

## PUT Requests

### 7. Update Restaurant
**Endpoint:** `PUT /:id`

**Description:** Updates restaurant data by ID. Prevents modification of ID fields and updates timestamp automatically.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Restaurant ID |

**Request Body:**
```json
{
  "name": "Updated Restaurant Name",
  "cuisine": "French",
  "borough": "Brooklyn",
  "phone": "555-1234"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Restaurant updated successfully",
  "data": {...}
}
```

---

## DELETE Requests

### 8. Delete Restaurant
**Endpoint:** `DELETE /:id`

**Description:** Deletes a restaurant by its ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Restaurant ID |

**Example Request:**
```
DELETE /api/restaurants/68e948d0914ae43b1162f94b
```

**Response:**
```json
{
  "success": true,
  "message": "Restaurant deleted successfully"
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": ["Name is required", "Cuisine is required"]
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Restaurant not found"
}
```

### Invalid ID Format (400)
```json
{
  "success": false,
  "message": "Invalid ID format"
}
```

### Duplicate Key Error (400)
```json
{
  "success": false,
  "message": "Error: This value must be unique"
}
```

### Internal Server Error (500)
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Notes

- All endpoints return a `success` boolean field
- Timestamps (created_at, updated_at) are managed automatically
- Comments default to 'anonymous' user if user_id is omitted
- Ratings must be between 1 and 5
- Text search uses MongoDB text index for relevance-based results
