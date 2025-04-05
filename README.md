# Bazar.com: A Multi-tier Online Book Store 

## Description

Bazar.com is a lightweight multi-tier online bookstore designed as part of a Distributed and Operating Systems lab. The application is structured into three primary components using microservices:

1. **Frontend Server** - Handles user requests (search, info, purchase).
2. **Catalog Server** - Manages book details (stock, price, topic).
3. **Order Server** - Handles the processing of book purchases.

The system utilizes a client-server model with HTTP REST APIs for communication between these components. The backend maintains book information and orders using persistent storage (CSV files), while the front-end interacts with users through simple API calls.

## Features

- **Frontend Operations:**
  - **Search by Topic**: Allows users to search for books by topic (e.g., Distributed Systems, Undergraduate School).
  - **Info on Book**: Provides details about a specific book (e.g., stock, price).
  - **Purchase Book**: Processes the purchase of a book by checking stock availability and recording the order.

- **Backend Operations:**
  - **Catalog Server**: Stores and manages book details. Supports two types of queries: by subject and by item number.
  - **Order Server**: Processes purchase requests, verifies stock, and logs orders.

## Architecture

- **Microservices**: 
  - Frontend Server: Handles user interactions.
  - Catalog Server: Manages book catalog data.
  - Order Server: Manages book orders and stock updates.
  
- **Persistent Data**: 
  - Data is stored in CSV files (`proj.csv` for books, `orders.csv` for orders).
  
- **REST APIs**: 
  - Each microservice exposes a set of RESTful endpoints (GET, POST, PUT) for interaction.

## System Requirements

- **Node.js**: Ensure you have Node.js installed on your machine.
- **Express**: Used for creating the REST API servers.
- **CSV Files**: Simple text-based storage for catalog and order data.
- **Docker**: Used for containerizing the application services.
  
## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/bazar-com.git
cd bazar-com
```
### 2. Install Dependencies
```bash
cd front-end
npm install

cd ../catalog-server
npm install

cd ../order-server
npm install

```

### 3. Docker Setup (Optional)
```bash
docker-compose up --build
```

This will start the following services:

- Frontend: Accessible on port 3000

- Catalog Server: Accessible on port 3001

- Order Server: Accessible on port 3002

## API Endpoints

#### Frontend Server:

*   **GET /search/{topic}**: Search books by topic.
    
    *   Example: `/search/distributed%20systems`
        
*   **GET /info/{item_number}**: Get details about a specific book by item number.
    
    *   Example: `/info/2`
        
*   **POST /purchase/{item_number}**: Purchase a book by item number and quantity.
    
    *   Example: `/purchase/2`
        
    *   Request Body: `{ "amount": 1 }`
        

#### Catalog Server:

*   **GET /search/{topic}**: Get all books by topic (distributed systems, undergraduate school).
    
*   **GET /info/{item_number}**: Get book details by item number.
    
*   **PUT /update/{item_number}**: Update the stock or price of a book.
    
    *   Example: `/update/2`
        

#### Order Server:

*   **POST /purchase/{item_number}**: Purchase a book by item number.
    
    *   Verifies stock and processes the order.


## Running the Tests

Tests are not yet implemented for this lab, but the system supports multiple concurrent requests and uses simple persistent storage. You can test the application by sending requests to the APIs listed above.

### Known Issues

*   The application does not currently handle database-level concurrency conflicts, as it relies on simple CSV files for persistence.
    
*   Some operations (such as order cancellations or updates to existing orders) are not implemented.
    

## Future Improvements

*   Integration with a real database (e.g., SQLite) for persistent data storage.
    
*   Adding user authentication for purchase and order management.
    
*   Extending the catalog to include more books and features.
    

## Contributing

Feel free to submit issues and pull requests. Contributions are welcome!


## Acknowledgements

*   Node.js and Express for backend development.
    
*   Docker for containerizing the services.
    
*   The academic team for the lab assignment guidance.
