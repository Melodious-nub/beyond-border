const { pool } = require('../config/database');

class ConsultantCommunity {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.emailAddress = data.emailAddress;
    this.phoneNumber = data.phoneNumber;
    this.linkedInProfile = data.linkedInProfile;
    this.company = data.company;
    this.designation = data.designation;
    this.yearsOfExperience = data.yearsOfExperience;
    // Parse JSON string to array if needed
    this.areasOfExpertise = typeof data.areasOfExpertise === 'string' 
      ? JSON.parse(data.areasOfExpertise) 
      : data.areasOfExpertise;
    this.whyJoinCommunity = data.whyJoinCommunity;
    this.howCanContribute = data.howCanContribute;
    this.email = data.email;
    this.whatsapp = data.whatsapp;
    this.slack = data.slack;
    this.openToMentoring = data.openToMentoring;
    this.agreement = data.agreement;
    this.status = data.status || 'new';
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Create a new consultant community membership
  static async create(communityData) {
    try {
      const { 
        name, 
        emailAddress, 
        phoneNumber, 
        linkedInProfile = null, // Default to null if undefined
        company, 
        designation, 
        yearsOfExperience, 
        areasOfExpertise, 
        whyJoinCommunity, 
        howCanContribute, 
        email, 
        whatsapp, 
        slack, 
        openToMentoring, 
        agreement 
      } = communityData;
      
      // Convert areasOfExpertise array to JSON string for storage
      const areasOfExpertiseJson = JSON.stringify(areasOfExpertise || []);
      
      const [result] = await pool.execute(
        `INSERT INTO consultant_community 
         (name, emailAddress, phoneNumber, linkedInProfile, company, designation, 
          yearsOfExperience, areasOfExpertise, whyJoinCommunity, howCanContribute, 
          email, whatsapp, slack, openToMentoring, agreement, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name, 
          emailAddress, 
          phoneNumber, 
          linkedInProfile, 
          company, 
          designation, 
          yearsOfExperience, 
          areasOfExpertiseJson, 
          whyJoinCommunity, 
          howCanContribute, 
          email, 
          whatsapp, 
          slack, 
          openToMentoring, 
          agreement, 
          'new'
        ]
      );
      
      // Return the created consultant community object
      const [rows] = await pool.execute(
        'SELECT * FROM consultant_community WHERE id = ?',
        [result.insertId]
      );
      
      return new ConsultantCommunity(rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Get all consultant community memberships with pagination
  static async findAll(page = 1, pageSize = 10) {
    try {
      const offset = (page - 1) * pageSize;
      
      const [rows] = await pool.execute(
        `SELECT * FROM consultant_community ORDER BY createdAt DESC LIMIT ${pageSize} OFFSET ${offset}`
      );
      
      const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM consultant_community');
      const total = countResult[0].total;
      
      const consultantCommunities = rows.map(row => new ConsultantCommunity(row));
      
      return {
        consultantCommunities,
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
      emailAddress: this.emailAddress,
      phoneNumber: this.phoneNumber,
      linkedInProfile: this.linkedInProfile,
      company: this.company,
      designation: this.designation,
      yearsOfExperience: this.yearsOfExperience,
      areasOfExpertise: this.areasOfExpertise,
      whyJoinCommunity: this.whyJoinCommunity,
      howCanContribute: this.howCanContribute,
      email: this.email,
      whatsapp: this.whatsapp,
      slack: this.slack,
      openToMentoring: this.openToMentoring,
      agreement: this.agreement,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = ConsultantCommunity;
