# Project 12

## Description

This project is a Node.js application that interacts with a MongoDB database to manage user data and clothing items. It provides RESTful APIs to handle CRUD operations for users and clothing items, along with liking and unliking functionalities for clothing items. The project uses modern JavaScript practices, including ES6 features, and is formatted with Prettier.

## Technologies and Techniques

- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM library for MongoDB and Node.js.
- **ESLint**: Linter for identifying and fixing problems in JavaScript code, configured with Airbnb's base rules.
- **Prettier**: Code formatter to ensure a consistent style.
- **Validator**: Library for validating strings, used for URL validation.

## Project Structure

- **`package.json`**: Contains project metadata, scripts, and dependencies.
- **`.editorconfig`**: Defines coding styles for consistent formatting across different editors.
- **`.eslintrc`**: ESLint configuration file extending Airbnb's base rules and excluding `_id` from linting.
- **`controllers/`**: Contains files defining route handlers.
- **`routes/`**: Contains files responsible for routing requests to appropriate controllers.
- **`models/`**: Contains schema and model definitions for MongoDB.
- **`utils/`**: Contains supportive data and utility functions.
- **`.gitignore`**: Specifies files and directories to be ignored by Git.
- **`README.md`**: Documentation file for the project.

## Scripts

- **`start`**: Launches the server on `localhost:3001`.
  ```bash
  npm run start
  ```
- **`dev`**: Launches the server on `localhost:3001` with hot reload enabled.
  ```bash
  npm run dev
  ```
- **`lint`**: Runs ESLint to check for code issues.
  ```bash
  npm run lint
  ```

## Database

- **MongoDB Connection**: Connects to MongoDB server at `mongodb://localhost:27017/wtwr_db`.
- **User Schema**:
  - `name`: Required string (2 to 30 characters).
  - `avatar`: Required string (valid URL).
- **Clothing Item Schema**:
  - `name`: Required string (2 to 30 characters).
  - `weather`: Required string (enum validator with values 'hot', 'warm', 'cold').
  - `imageUrl`: Required string (valid URL).
  - `owner`: Required `ObjectId` linking to the user schema.
  - `likes`: Required array of `ObjectId`s linking to the user schema.
  - `createdAt`: Required date.

**Valid URLs**:
- `http://example.com/`
- `https://www.example.com/`
- `http://1-example.com`
- `http://example.com/go/even/deeper/`
- `http://example-example-example.com`

**Invalid URLs**:
- `https://thisisnotvalidurl`
- `https://x~>!`

## Models

- **User Model**: Defined in `models/user.js`.
- **Clothing Item Model**: Defined in `models/clothingItem.js`.

## Routes

- **Users Routes**:
  - `GET /users`: Return all users.
  - `GET /users/:userId`: Return a user by `_id`.
  - `POST /users`: Create a new user.

- **Clothing Items Routes**:
  - `GET /items`: Return all clothing items.
  - `POST /items`: Create a clothing item with `name`, `imageUrl`, and `weather`. `owner` is set from `req.user._id`.
  - `DELETE /items/:id`: Delete a clothing item by `_id`.
  - `PUT /items/:id/likes`: Like a clothing item (use `{ new: true }` for options).
  - `DELETE /items/:id/likes`: Unlike a clothing item (use `{ new: true }` for options).

