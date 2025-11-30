# Restaurant API - Filtering and Sorting Documentation

## Overview

This endpoint allows retrieving a list of restaurants with advanced filtering, sorting, and pagination options. Users can search restaurants based on various criteria and order results in multiple ways.

---

## Query Parameters

### Pagination Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|------------|
| `page` | number | 1 | Page number for pagination |
| `limit` | number | 10 | Number of results per page |

---

## Filtering Parameters

Filters allow reducing results based on specific criteria. All filters are **optional** and can be combined with each other.

| Parameter | Type | Description | Example |
|-----------|------|------------|---------|
| `cuisine` | string | Type of cuisine the restaurant offers | `italian`, `chinese`, `mexican` |
| `borough` | string | District or area where the restaurant is located | `manhattan`, `brooklyn`, `queens` |
| `price_range` | number/string | Price range (typically 1-4) | `2`, `3` |
| `address_zipcode` | string | Postal code of the restaurant | `10001`, `10002` |

### Filtering Examples

**Search for Italian restaurants in Manhattan:**
```
GET /restaurants?cuisine=italian&borough=manhattan
```

**Search for budget-friendly restaurants in a specific zipcode:**
```
GET /restaurants?price_range=1&address_zipcode=10001
```

**Combine multiple filters:**
```
GET /restaurants?cuisine=chinese&borough=brooklyn&price_range=2
```

---

## Sorting Parameters

The `sortBy` parameter controls the order in which results are displayed. Only **one sorting criterion** can be used per request.

| Value | Description | Order | Database Field |
|-------|-----------|-------|----------------|
| `rating` | Sorts by rating from highest to lowest | Descending | `grades.score` |
| `name` | Sorts alphabetically by name | Ascending | `name` |
| `newest` | Sorts by creation date, most recent first | Descending | `created_at` |
| `price_asc` | Sorts by price from lowest to highest | Ascending | `price_range` |
| `price_desc` | Sorts by price from highest to lowest | Descending | `price_range` |
| `borough` | Sorts alphabetically by district | Ascending | `borough` |

### Sorting Examples

**Top-rated restaurants:**
```
GET /restaurants?sortBy=rating
```

**Restaurants sorted by name (A-Z):**
```
GET /restaurants?sortBy=name
```

**Most recently added restaurants:**
```
GET /restaurants?sortBy=newest
```

**Restaurants from lowest to highest price:**
```
GET /restaurants?sortBy=price_asc
```

---

## How the Code Works

### 1. Parameter Extraction

```javascript
const { page = 1, limit = 10, cuisine, borough, sortBy, price_range, address_zipcode } = req.query;
```

All query parameters are extracted with default values for `page` and `limit`.

### 2. Filter Construction

```javascript
const filter = {};
if (cuisine) filter.cuisine = cuisine;
if (borough) filter.borough = borough;
if (price_range) filter.price_range = price_range;
if (address_zipcode) filter['address.zipcode'] = address_zipcode;
```

A `filter` object is created that only includes provided criteria. This allows optional filters that can be combined.

### 3. Sorting Construction

```javascript
const sort = {};
if (sortBy === 'rating') sort['grades.score'] = -1;
else if (sortBy === 'name') sort.name = 1;
// ... more conditions
```

The `sort` object is defined based on the specified criterion. Values represent:
- `1`: ascending order (A-Z, lowest to highest)
- `-1`: descending order (Z-A, highest to lowest)

### 4. Pagination Calculation

```javascript
const skip = (page - 1) * limit;
```

This calculates how many documents to "skip" to get the requested page. For example:
- Page 1, limit 10: skip = 0 (first 10 documents)
- Page 2, limit 10: skip = 10 (documents 11-20)
- Page 3, limit 10: skip = 20 (documents 21-30)

### 5. Database Query

```javascript
const restaurants = await Restaurant.find(filter)
  .sort(sort)
  .limit(parseInt(limit))
  .skip(skip);
```

The query is executed applying the filter, sorting, limit, and pagination.

### 6. Response

```javascript
res.json({
  success: true,
  data: restaurants,
  pagination: {
    current_page: parseInt(page),
    total_pages: Math.ceil(total / limit),
    total_documents: total,
    limit: parseInt(limit)
  }
});
```

Restaurant information is returned along with pagination data so the client knows the total number of pages available.

---

## Complete Usage Examples

### Example 1: Italian restaurants in Manhattan, sorted by rating

```
GET /restaurants?cuisine=italian&borough=manhattan&sortBy=rating&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "123abc",
      "name": "Trattoria Roma",
      "cuisine": "italian",
      "borough": "manhattan",
      "grades": { "score": 28 },
      "price_range": 3
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_documents": 47,
    "limit": 10
  }
}
```

### Example 2: Budget-friendly restaurants sorted by price ascending

```
GET /restaurants?price_range=1&sortBy=price_asc&page=1&limit=20
```

### Example 3: Restaurants in zipcode 10001, most recent first

```
GET /restaurants?address_zipcode=10001&sortBy=newest
```

---

## Important Notes

- Filters are **cumulative**: if you provide more than one, all must be satisfied simultaneously
- Only one `sortBy` value can be used per request
- If no `sortBy` is provided, results are shown in the database's default order
- `page` and `limit` values are converted to integers to prevent errors
- Pagination automatically calculates the total number of available pages