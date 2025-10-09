const { validationResult } = require('express-validator');
const Team = require('../models/Team');

/**
 * Create a new team member (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createTeamMember = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Extract data from request body and file
    const teamData = {
      name: req.body.name,
      email: req.body.email,
      designation: req.body.designation,
      avatar: req.file ? req.file.path : null, // Handle file upload
      status: req.body.status || 'active',
      isManagement: req.body.isManagement === 'true' || false,
      phoneNumber: req.body.phoneNumber || null,
      department: req.body.department || null,
      linkedinUrl: req.body.linkedinUrl || null,
      facebookUrl: req.body.facebookUrl || null,
      twitterUrl: req.body.twitterUrl || null,
      instagramUrl: req.body.instagramUrl || null,
      redditUrl: req.body.redditUrl || null,
      description: req.body.description || null
    };

    // Check if email already exists
    const existingMember = await Team.findByEmail(teamData.email);
    if (existingMember) {
      return res.status(409).json({
        success: false,
        message: 'Team member with this email already exists'
      });
    }

    // Create team member
    const teamMember = await Team.create(teamData);

    // Replace avatar path with full URL
    const memberData = teamMember.toJSON();
    if (memberData.avatar) {
      // Handle both Windows (\) and Unix (/) path separators
      const filename = memberData.avatar.split(/[/\\]/).pop();
      memberData.avatar = `${req.protocol}://${req.get('host')}/uploads/avatars/${filename}`;
    } else {
      memberData.avatar = null;
    }

    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      data: {
        teamMember: memberData
      }
    });
  } catch (error) {
    console.error('Create team member error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Team member with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create team member'
    });
  }
};

/**
 * Get all team members with pagination (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllTeamMembers = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, status, isManagement, department, search } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (isManagement !== undefined) filters.isManagement = isManagement === 'true';
    if (department) filters.department = department;
    if (search) filters.search = search;

    const result = await Team.findAll(parseInt(page), parseInt(pageSize), filters);

    // Replace avatar paths with full URLs for each team member
    if (result.teams) {
      result.teams = result.teams.map(member => {
        const memberData = member.toJSON ? member.toJSON() : member;
        if (memberData.avatar) {
          const filename = memberData.avatar.split(/[/\\]/).pop();
          memberData.avatar = `${req.protocol}://${req.get('host')}/uploads/avatars/${filename}`;
        } else {
          memberData.avatar = null;
        }
        return memberData;
      });
    }

    res.json({
      success: true,
      message: 'Team members retrieved successfully',
      data: result
    });
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve team members'
    });
  }
};

/**
 * Get team member by ID (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTeamMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    const teamMember = await Team.findById(id);
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Replace avatar path with full URL
    const memberData = teamMember.toJSON();
    if (memberData.avatar) {
      // Handle both Windows (\) and Unix (/) path separators
      const filename = memberData.avatar.split(/[/\\]/).pop();
      memberData.avatar = `${req.protocol}://${req.get('host')}/uploads/avatars/${filename}`;
    } else {
      memberData.avatar = null;
    }

    res.json({
      success: true,
      message: 'Team member retrieved successfully',
      data: {
        teamMember: memberData
      }
    });
  } catch (error) {
    console.error('Get team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve team member'
    });
  }
};

/**
 * Update team member (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateTeamMember = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;

    const teamMember = await Team.findById(id);
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Extract data from request body and file
    const updateData = {
      name: req.body.name,
      email: req.body.email,
      designation: req.body.designation,
      status: req.body.status,
      isManagement: req.body.isManagement === 'true' || false,
      phoneNumber: req.body.phoneNumber || null,
      department: req.body.department || null,
      linkedinUrl: req.body.linkedinUrl || null,
      facebookUrl: req.body.facebookUrl || null,
      twitterUrl: req.body.twitterUrl || null,
      instagramUrl: req.body.instagramUrl || null,
      redditUrl: req.body.redditUrl || null,
      description: req.body.description || null
    };

    // Handle avatar update
    if (req.file) {
      updateData.avatar = req.file.path;
    }

    // Check if email is being changed and if it already exists
    if (updateData.email && updateData.email !== teamMember.email) {
      const emailExists = await Team.findByEmail(updateData.email);
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    await teamMember.update(updateData);

    // Replace avatar path with full URL
    const memberData = teamMember.toJSON();
    if (memberData.avatar) {
      // Handle both Windows (\) and Unix (/) path separators
      const filename = memberData.avatar.split(/[/\\]/).pop();
      memberData.avatar = `${req.protocol}://${req.get('host')}/uploads/avatars/${filename}`;
    } else {
      memberData.avatar = null;
    }

    res.json({
      success: true,
      message: 'Team member updated successfully',
      data: {
        teamMember: memberData
      }
    });
  } catch (error) {
    console.error('Update team member error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update team member'
    });
  }
};

/**
 * Delete team member (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const teamMember = await Team.findById(id);
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    await teamMember.delete();
    
    res.json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete team member'
    });
  }
};

/**
 * Get all active team members (Public)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllActiveTeamMembers = async (req, res) => {
  try {
    const teamMembers = await Team.findAllActive();

    // Replace avatar paths with full URLs for each team member
    const teamMembersWithUrls = teamMembers.map(member => {
      const memberData = member.toPublicJSON ? member.toPublicJSON() : member.toJSON();
      if (memberData.avatar) {
        const filename = memberData.avatar.split(/[/\\]/).pop();
        memberData.avatar = `${req.protocol}://${req.get('host')}/uploads/avatars/${filename}`;
      } else {
        memberData.avatar = null;
      }
      return memberData;
    });

    res.json({
      success: true,
      message: 'Active team members retrieved successfully',
      data: {
        teamMembers: teamMembersWithUrls
      }
    });
  } catch (error) {
    console.error('Get active team members error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve active team members'
    });
  }
};

/**
 * Get team statistics (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTeamStats = async (req, res) => {
  try {
    const stats = await Team.getStats();

    res.json({
      success: true,
      message: 'Team statistics retrieved successfully',
      data: {
        stats
      }
    });
  } catch (error) {
    console.error('Get team stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve team statistics'
    });
  }
};

module.exports = {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
  getAllActiveTeamMembers,
  getTeamStats
};
