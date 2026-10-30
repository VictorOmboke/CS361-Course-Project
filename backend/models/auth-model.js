import pool from "../database/db-connect";

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

  // Edit user names
  async editUserNames(user_id, first_name, last_name) {
    const query = `
        UPDATE Users
        SET first_name = ? AND last_name = ?
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
    result.affectedRows;
  },
};

export default AuthModel;