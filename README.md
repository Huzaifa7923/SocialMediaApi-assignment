# SocialMediaApi-assignment

## Overview
This project is a REST API developed using Node.js and MongoDB, aimed at providing functionality for managing users and posts. It includes features such as rate limiting, throttling, data validation using Joi, HTML sanitization, and integration with Redis for caching. By leveraging these technologies, the API achieves improved performance, security, and scalability.

## Features

### Rate Limiting and Throttling
- Implements rate limiting and throttling to prevent abuse and ensure fair usage of the API.
- Helps maintain system stability and prevent overload during high traffic periods.

### Redis Integration
- Utilizes Redis for caching frequently accessed data, reducing response times and improving overall performance.
- Example: Data retrieval time for posts reduced from ==114 ms to 4 ms== by leveraging Redis caching.

### Data Validation with Joi
- Validates input data to ensure it meets specified criteria, enhancing data integrity and security.
- Ensures that only valid and sanitized data is processed by the API, reducing the risk of security vulnerabilities.

### HTML Sanitization
- Sanitizes HTML input to remove potentially malicious content and prevent cross-site scripting (XSS) attacks.
- Enhances security by sanitizing user-generated content before storing or displaying it.

### MongoDB Aggregation Pipelines
- Utilizes MongoDB aggregation pipelines for advanced data processing and analysis.
- Enables complex queries and data transformations, facilitating efficient data retrieval and manipulation.

### User and Post Management
- Provides functionality for managing users, including features such as registration, login, profile updates, and following/followers relationships.
- Supports CRUD operations for posts, allowing users to create, read, update, and delete posts.

## Technologies Used
- Node.js
- MongoDB
- Redis
- Joi (Data validation)
- Sanitize-html (HTML sanitization)
- Bcrypt.js (Password hashing)

## Getting Started
To run the project locally, follow these steps:
1. Clone the repository. `git clone https://github.com/Huzaifa7923/SocialMediaApi-assignment`
2. Install dependencies using `npm install`.
3. Configure environment variables present in sample.
4. Start the server using `npm run dev`.

