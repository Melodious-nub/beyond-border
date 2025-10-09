const { pool } = require('../config/database');

class Team {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.avatar = data.avatar;
    this.designation = data.designation;
    this.status = data.status || 'active';
    this.isManagement = data.isManagement || false;
    this.phoneNumber = data.phoneNumber;
    this.department = data.department;
    this.linkedinUrl = data.linkedinUrl;
    this.facebookUrl = data.facebookUrl;
    this.twitterUrl = data.twitterUrl;
    this.instagramUrl = data.instagramUrl;
    this.redditUrl = data.redditUrl;
    this.description = data.description;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Create a new team member
  static async create(teamData) {
    try {
      const {
        name,
        email,
        avatar,
        designation,
        status = 'active',
        isManagement = false,
        phoneNumber,
        department,
        linkedinUrl,
        facebookUrl,
        twitterUrl,
        instagramUrl,
        redditUrl,
        description
      } = teamData;
      
      const [result] = await pool.execute(
        `INSERT INTO teams (
          name, email, avatar, designation, status, isManagement,
          phoneNumber, department, linkedinUrl, facebookUrl, twitterUrl,
          instagramUrl, redditUrl, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name, email, avatar, designation, status, isManagement,
          phoneNumber, department, linkedinUrl, facebookUrl, twitterUrl,
          instagramUrl, redditUrl, description
        ]
      );
      
      // Return the created team member object
      const [rows] = await pool.execute(
        'SELECT * FROM teams WHERE id = ?',
        [result.insertId]
      );
      
      return new Team(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find team member by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM teams WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? new Team(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find team member by email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM teams WHERE email = ?',
        [email]
      );
      
      return rows.length > 0 ? new Team(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Get all team members with pagination (Admin only)
  static async findAll(page = 1, pageSize = 10, filters = {}) {
    try {
      const offset = (page - 1) * pageSize;
      let whereClause = '';
      let params = [];
      
      // Build where clause based on filters
      if (filters.status) {
        whereClause += ' WHERE status = ?';
        params.push(filters.status);
      }
      
      if (filters.isManagement !== undefined) {
        whereClause += whereClause ? ' AND isManagement = ?' : ' WHERE isManagement = ?';
        params.push(filters.isManagement);
      }
      
      if (filters.department) {
        whereClause += whereClause ? ' AND department = ?' : ' WHERE department = ?';
        params.push(filters.department);
      }
      
      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        whereClause += whereClause ? ' AND (name LIKE ? OR email LIKE ? OR designation LIKE ?)' : ' WHERE (name LIKE ? OR email LIKE ? OR designation LIKE ?)';
        params.push(searchTerm, searchTerm, searchTerm);
      }
      
      const [rows] = await pool.execute(
        `SELECT * FROM teams ${whereClause} ORDER BY isManagement DESC, name ASC LIMIT ${pageSize} OFFSET ${offset}`,
        params
      );
      
      const [countResult] = await pool.execute(
        `SELECT COUNT(*) as total FROM teams ${whereClause}`,
        params
      );
      const total = countResult[0].total;
      
      const teams = rows.map(row => new Team(row));
      
      return {
        teams,
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

  // Get all active team members (Public)
  static async findAllActive() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM teams WHERE status = "active" ORDER BY isManagement DESC, name ASC'
      );
      
      return rows.map(row => new Team(row));
    } catch (error) {
      throw error;
    }
  }

  // Get team statistics
  static async getStats() {
    try {
      const [totalResult] = await pool.execute('SELECT COUNT(*) as total FROM teams');
      const [activeResult] = await pool.execute('SELECT COUNT(*) as active FROM teams WHERE status = "active"');
      const [managementResult] = await pool.execute('SELECT COUNT(*) as management FROM teams WHERE isManagement = true');
      const [departmentsResult] = await pool.execute('SELECT department, COUNT(*) as count FROM teams WHERE department IS NOT NULL GROUP BY department');
      
      return {
        total: totalResult[0].total,
        active: activeResult[0].active,
        management: managementResult[0].management,
        departments: departmentsResult
      };
    } catch (error) {
      throw error;
    }
  }

  // Update team member
  async update(updateData) {
    try {
      const allowedFields = [
        'name', 'email', 'avatar', 'designation', 'status', 'isManagement',
        'phoneNumber', 'department', 'linkedinUrl', 'facebookUrl', 'twitterUrl',
        'instagramUrl', 'redditUrl', 'description'
      ];
      
      const updates = [];
      const values = [];

      for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key) && value !== undefined) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }

      if (updates.length === 0) {
        throw new Error('No valid fields to update');
      }

      values.push(this.id);

      await pool.execute(
        `UPDATE teams SET ${updates.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        values
      );

      // Update local instance
      Object.assign(this, updateData);
      return this;
    } catch (error) {
      throw error;
    }
  }

  // Delete team member
  async delete() {
    try {
      await pool.execute('DELETE FROM teams WHERE id = ?', [this.id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get team member data
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      avatar: this.avatar,
      designation: this.designation,
      status: this.status,
      isManagement: this.isManagement,
      phoneNumber: this.phoneNumber,
      department: this.department,
      linkedinUrl: this.linkedinUrl,
      facebookUrl: this.facebookUrl,
      twitterUrl: this.twitterUrl,
      instagramUrl: this.instagramUrl,
      redditUrl: this.redditUrl,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Get public team member data (without sensitive info)
  toPublicJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      avatar: this.avatar,
      designation: this.designation,
      isManagement: this.isManagement,
      phoneNumber: this.phoneNumber,
      department: this.department,
      linkedinUrl: this.linkedinUrl,
      facebookUrl: this.facebookUrl,
      twitterUrl: this.twitterUrl,
      instagramUrl: this.instagramUrl,
      redditUrl: this.redditUrl,
      description: this.description
    };
  }
}

module.exports = Team;
