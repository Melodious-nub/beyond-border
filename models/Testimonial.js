const { pool } = require('../config/database');

class Testimonial {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.department = data.department;
    this.designation = data.designation;
    this.description = data.description;
    this.image = data.image;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Create new testimonial
  static async create(testimonialData) {
    try {
      const { name, department, designation, description, image } = testimonialData;
      
      const [result] = await pool.execute(
        'INSERT INTO testimonials (name, department, designation, description, image) VALUES (?, ?, ?, ?, ?)',
        [name, department, designation, description, image]
      );
      
      // Return the created testimonial
      const [rows] = await pool.execute(
        'SELECT * FROM testimonials WHERE id = ?',
        [result.insertId]
      );
      
      return new Testimonial(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM testimonials WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? new Testimonial(rows[0]) : null;
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
        'SELECT COUNT(*) as total FROM testimonials'
      );
      const total = countResult[0].total;
      
      // Get paginated results
      const [rows] = await pool.execute(
        `SELECT * FROM testimonials ORDER BY createdAt DESC LIMIT ${pageSize} OFFSET ${offset}`
      );
      
      const items = rows.map(row => new Testimonial(row));
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
        'SELECT * FROM testimonials ORDER BY createdAt ASC'
      );
      
      return rows.map(row => new Testimonial(row));
    } catch (error) {
      throw error;
    }
  }

  // Update testimonial
  async update(updateData) {
    try {
      const { name, department, designation, description, image } = updateData;
      
      await pool.execute(
        'UPDATE testimonials SET name = ?, department = ?, designation = ?, description = ?, image = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [name, department, designation, description, image, this.id]
      );

      // Update local instance
      this.name = name;
      this.department = department;
      this.designation = designation;
      this.description = description;
      this.image = image;
      return this;
    } catch (error) {
      throw error;
    }
  }

  // Delete testimonial
  async delete() {
    try {
      await pool.execute('DELETE FROM testimonials WHERE id = ?', [this.id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get testimonial data
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      department: this.department,
      designation: this.designation,
      description: this.description,
      image: this.image,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Testimonial;
