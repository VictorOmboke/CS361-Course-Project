import pool from "../database/db-connect.js";

const AuthModel = {
  // Register user
  async registerUser(first_name, last_name, email, password) {
    const query = `
        INSERT INTO Users (first_name, last_name, email, password) 
        VALUES (?, ?, ?, ?);
      `;

    const [result] = await pool.execute(query, [
      first_name,
      last_name,
      email,
      password,
    ]);

    // Return new user ID
    return result.insertId;
  },

  //Find user by ID
  async findUserByID(user_id) {
    const query = `
        SELECT user_id, first_name, last_name, email 
        FROM Users 
        WHERE user_id = ?;
    `;
    const [rows] = await pool.execute(query, [user_id]);

    // Return the single user object
    return rows[0];
  },

  // Find user by email
  async findUserByEmail(email) {
    const query = `
        SELECT user_id, password
        FROM Users
        WHERE email = ?;
    `;
    const [rows] = await pool.execute(query, [email]);

    // Return the user data
    return rows[0];
  },

  // Get a user's password (SENSITIVE DATA - FOR PASSWORD CHANGES ONLY)
  async getUserPassword(user_id) {
    const query = `
        SELECT password
        FROM Users
        WHERE user_id = ?;
    `;
    const [rows] = await pool.execute(query, [user_id]);

    // Return password
    return rows[0].password;
  },

  // Edit user names
  async updateUserNames(user_id, first_name, last_name) {
    const query = `
        UPDATE Users
        SET first_name = ?, last_name = ?
        WHERE user_id = ?;
    `;
    const [result] = await pool.execute(query, [
      first_name,
      last_name,
      user_id,
    ]);

    // Return number of affected rows
    return result.affectedRows;
  },

  // Update a user's password
  async updatePassword(user_id, password) {
    const query = `
        UPDATE Users 
        SET password = ?
        WHERE user_id = ?;
    `;
    const [result] = await pool.execute(query, [password, user_id]);

    // Return number of affected rows
    return result.affectedRows;
  },

  // Delete a user
  async deleteUser(user_id) {
    const query = `
        DELETE FROM Users
        WHERE user_id = ?;
    `;
    const [result] = await pool.execute(query, [user_id]);

    // Return number of affected rows
    return result.affectedRows;
  },
};

export default AuthModel;
