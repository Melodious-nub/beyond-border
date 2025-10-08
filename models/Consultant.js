const { pool } = require('../config/database');

class Consultant {
  constructor(data) {
    this.id = data.id;
    this.ngoName = data.ngoName;
    this.ngoRegistrationNumber = data.ngoRegistrationNumber;
    this.chairmanPresidentName = data.chairmanPresidentName;
    this.specializedAreas = data.specializedAreas;
    this.planningToExpand = data.planningToExpand;
    this.expansionRegions = data.expansionRegions;
    this.needFundingSupport = data.needFundingSupport;
    this.totalFundRequired = data.totalFundRequired;
    this.lookingForFundManager = data.lookingForFundManager;
    this.openToSplittingInvestment = data.openToSplittingInvestment;
    this.hasSpecializedTeam = data.hasSpecializedTeam;
    this.needAssistance = data.needAssistance;
    this.emailAddress = data.emailAddress;
    this.websiteAddress = data.websiteAddress;
    this.phoneNumber = data.phoneNumber;
    this.status = data.status || 'new';
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Create a new consultant request
  static async create(consultantData) {
    try {
      const {
        ngoName,
        ngoRegistrationNumber,
        chairmanPresidentName,
        specializedAreas,
        planningToExpand,
        expansionRegions,
        needFundingSupport,
        totalFundRequired,
        lookingForFundManager,
        openToSplittingInvestment,
        hasSpecializedTeam,
        needAssistance,
        emailAddress,
        websiteAddress,
        phoneNumber
      } = consultantData;
      
      const [result] = await pool.execute(
        `INSERT INTO consultants (
          ngoName, ngoRegistrationNumber, chairmanPresidentName, specializedAreas,
          planningToExpand, expansionRegions, needFundingSupport, totalFundRequired,
          lookingForFundManager, openToSplittingInvestment, hasSpecializedTeam,
          needAssistance, emailAddress, websiteAddress, phoneNumber, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ngoName, ngoRegistrationNumber, chairmanPresidentName, specializedAreas,
          planningToExpand, expansionRegions, needFundingSupport, totalFundRequired,
          lookingForFundManager, openToSplittingInvestment, hasSpecializedTeam,
          needAssistance, emailAddress, websiteAddress, phoneNumber, 'new'
        ]
      );
      
      // Return the created consultant object
      const [rows] = await pool.execute(
        'SELECT * FROM consultants WHERE id = ?',
        [result.insertId]
      );
      
      return new Consultant(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find consultant by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM consultants WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? new Consultant(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Get all consultants with pagination
  static async findAll(page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;
      
      const [rows] = await pool.execute(
        `SELECT * FROM consultants ORDER BY createdAt DESC LIMIT ${pageSize} OFFSET ${offset}`
      );
      
      const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM consultants');
      const total = countResult[0].total;
      
      const consultants = rows.map(row => new Consultant(row));
      
      return {
        consultants,
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

  // Update consultant status
  async updateStatus(status) {
    try {
      await pool.execute(
        'UPDATE consultants SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [status, this.id]
      );
      
      this.status = status;
      return this;
    } catch (error) {
      throw error;
    }
  }

  // Delete consultant
  async delete() {
    try {
      await pool.execute('DELETE FROM consultants WHERE id = ?', [this.id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get consultant data
  toJSON() {
    return {
      id: this.id,
      ngoName: this.ngoName,
      ngoRegistrationNumber: this.ngoRegistrationNumber,
      chairmanPresidentName: this.chairmanPresidentName,
      specializedAreas: this.specializedAreas,
      planningToExpand: this.planningToExpand,
      expansionRegions: this.expansionRegions,
      needFundingSupport: this.needFundingSupport,
      totalFundRequired: this.totalFundRequired,
      lookingForFundManager: this.lookingForFundManager,
      openToSplittingInvestment: this.openToSplittingInvestment,
      hasSpecializedTeam: this.hasSpecializedTeam,
      needAssistance: this.needAssistance,
      emailAddress: this.emailAddress,
      websiteAddress: this.websiteAddress,
      phoneNumber: this.phoneNumber,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Consultant;
