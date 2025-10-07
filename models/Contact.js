const { pool } = require('../config/database');

class Contact {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.description = data.description;
    this.status = data.status || 'new';
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Create a new contact message
  static async create(contactData) {
    try {
      const { name, email, description } = contactData;
      
      const [result] = await pool.execute(
        'INSERT INTO contacts (name, email, description, status) VALUES (?, ?, ?, ?)',
        [name, email, description, 'new']
      );
      
      // Return the created contact object
      const [rows] = await pool.execute(
        'SELECT * FROM contacts WHERE id = ?',
        [result.insertId]
      );
      
      return new Contact(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Get all contact messages with pagination
  static async findAll(page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;
      
      const [rows] = await pool.execute(
        `SELECT * FROM contacts ORDER BY createdAt DESC LIMIT ${pageSize} OFFSET ${offset}`
      );
      
      const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM contacts');
      const total = countResult[0].total;
      
      const contacts = rows.map(row => new Contact(row));
      
      return {
        contacts,
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total: parseInt(total),
          pages: Math.ceil(total / pageSize)
        }
      };
    } catch (error) {
      throw error;
    }
  }


  // Get user data without sensitive information
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Contact;
