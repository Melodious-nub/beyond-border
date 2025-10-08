const { pool } = require('../config/database');

class Page {
  constructor(data) {
    this.id = data.id;
    this.page = data.page;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Create a new page
  static async create(pageData) {
    try {
      const { page } = pageData;
      
      const [result] = await pool.execute(
        'INSERT INTO pages (page) VALUES (?)',
        [page]
      );
      
      // Return the created page object
      const [rows] = await pool.execute(
        'SELECT * FROM pages WHERE id = ?',
        [result.insertId]
      );
      
      return new Page(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find page by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM pages WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? new Page(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find page by page slug
  static async findByPage(page) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM pages WHERE page = ?',
        [page]
      );
      
      return rows.length > 0 ? new Page(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Get all pages
  static async findAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM pages ORDER BY page ASC'
      );
      
      return rows.map(row => new Page(row));
    } catch (error) {
      throw error;
    }
  }

  // Get all pages for dropdown
  static async findAllForDropdown() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM pages ORDER BY page ASC'
      );
      
      return rows.map(row => new Page(row));
    } catch (error) {
      throw error;
    }
  }

  // Check if page slug exists
  static async pageExists(page, excludeId = null) {
    try {
      let query = 'SELECT id FROM pages WHERE page = ?';
      let params = [page];
      
      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }
      
      const [rows] = await pool.execute(query, params);
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Update page
  async update(updateData) {
    try {
      const { page } = updateData;
      
      await pool.execute(
        'UPDATE pages SET page = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [page, this.id]
      );

      // Update local instance
      this.page = page;
      return this;
    } catch (error) {
      throw error;
    }
  }

  // Delete page
  async delete() {
    try {
      await pool.execute('DELETE FROM pages WHERE id = ?', [this.id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get page data
  toJSON() {
    return {
      id: this.id,
      page: this.page,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

}

module.exports = Page;
