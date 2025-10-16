const { pool } = require('../config/database');

class WhyChooseUs {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.details = data.details;
    this.image = data.image;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Create new why choose us item
  static async create(whyChooseUsData) {
    try {
      const { title, details, image } = whyChooseUsData;
      
      const [result] = await pool.execute(
        'INSERT INTO why_choose_us (title, details, image) VALUES (?, ?, ?)',
        [title, details, image]
      );
      
      // Return the created item
      const [rows] = await pool.execute(
        'SELECT * FROM why_choose_us WHERE id = ?',
        [result.insertId]
      );
      
      return new WhyChooseUs(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM why_choose_us WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? new WhyChooseUs(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Get all with pagination (Admin)
  static async findAll(page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;
      
      // Get total count
      const [countResult] = await pool.execute(
        'SELECT COUNT(*) as total FROM why_choose_us'
      );
      const total = countResult[0].total;
      
      // Get paginated results
      const [rows] = await pool.execute(
        `SELECT * FROM why_choose_us ORDER BY createdAt DESC LIMIT ${pageSize} OFFSET ${offset}`
      );
      
      const items = rows.map(row => new WhyChooseUs(row));
      const pages = Math.ceil(total / pageSize);
      
      return {
        items,
        pagination: {
          page,
          pageSize,
          total,
          pages
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get all for public (no pagination)
  static async findAllPublic() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM why_choose_us ORDER BY createdAt ASC'
      );
      
      return rows.map(row => new WhyChooseUs(row));
    } catch (error) {
      throw error;
    }
  }

  // Update item
  async update(updateData) {
    try {
      const { title, details, image } = updateData;
      
      await pool.execute(
        'UPDATE why_choose_us SET title = ?, details = ?, image = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [title, details, image, this.id]
      );

      // Update local instance
      this.title = title;
      this.details = details;
      this.image = image;
      return this;
    } catch (error) {
      throw error;
    }
  }

  // Delete item
  async delete() {
    try {
      await pool.execute('DELETE FROM why_choose_us WHERE id = ?', [this.id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get item data
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      details: this.details,
      image: this.image,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = WhyChooseUs;
