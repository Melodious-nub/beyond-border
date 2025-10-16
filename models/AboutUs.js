const { pool } = require('../config/database');

class AboutUs {
  constructor(data) {
    this.id = data.id;
    this.description = data.description;
    this.image = data.image;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Create or update about us (single record)
  static async createOrUpdate(aboutUsData) {
    try {
      const { description, image } = aboutUsData;
      
      // Check if record already exists
      const existingRecord = await AboutUs.findFirst();
      
      if (existingRecord) {
        // Update existing record
        await existingRecord.update({ description, image });
        return existingRecord;
      } else {
        // Create new record
        const [result] = await pool.execute(
          'INSERT INTO about_us (description, image) VALUES (?, ?)',
          [description, image]
        );
        
        // Return the created record
        const [rows] = await pool.execute(
          'SELECT * FROM about_us WHERE id = ?',
          [result.insertId]
        );
        
        return new AboutUs(rows[0]);
      }
    } catch (error) {
      throw error;
    }
  }

  // Find first (and only) record
  static async findFirst() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM about_us ORDER BY id ASC LIMIT 1'
      );
      
      return rows.length > 0 ? new AboutUs(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Update record
  async update(updateData) {
    try {
      const { description, image } = updateData;
      
      await pool.execute(
        'UPDATE about_us SET description = ?, image = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [description, image, this.id]
      );

      // Update local instance
      this.description = description;
      this.image = image;
      return this;
    } catch (error) {
      throw error;
    }
  }

  // Get record data
  toJSON() {
    return {
      id: this.id,
      description: this.description,
      image: this.image,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = AboutUs;
