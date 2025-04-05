# Bazar.com: A Multi-tier Online Book Store (Distributed and Operating Systems - Spring 2019)

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
