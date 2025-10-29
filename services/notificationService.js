const Notification = require('../models/Notification');
const eventEmitter = require('./eventEmitter');

class NotificationService {
  constructor() {
    // Store SSE connections: Map<userId, response>
    this.connections = new Map();
    
    // Heartbeat interval (30 seconds)
    this.heartbeatInterval = 30000;
    
    // Start heartbeat to keep connections alive
    this.startHeartbeat();
    
    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Setup event listeners for different types of events
   */
  setupEventListeners() {
    // Listen for contact creation events
    eventEmitter.on('contact:created', (contactData) => {
      this.handleContactCreated(contactData);
    });

    // Listen for consultant request creation events
    eventEmitter.on('consultant:created', (consultantData) => {
      this.handleConsultantCreated(consultantData);
    });

    // Listen for community member request creation events
    eventEmitter.on('community:created', (communityData) => {
      this.handleCommunityCreated(communityData);
    });

    console.log('📡 Notification service event listeners registered');
  }

  /**
   * Handle contact created event
   */
  async handleContactCreated(contactData) {
    try {
      const notification = await Notification.create({
        title: 'New Contact Inquiry',
        message: `${contactData.name} submitted a contact inquiry`,
        route: '/api/contact',
        targetRoute: '/admin/contact-responses',
        referenceId: contactData.id,
        type: 'contact'
      });

      this.broadcastToClients(notification.toJSON());
      console.log('✅ Contact notification created and broadcast');
    } catch (error) {
      console.error('Error creating contact notification:', error);
    }
  }

  /**
   * Handle consultant created event
   */
  async handleConsultantCreated(consultantData) {
    try {
      const notification = await Notification.create({
        title: 'New Consultant Request',
        message: `${consultantData.ngoName} requested consultancy services`,
        route: '/api/consultants',
        targetRoute: '/admin/consultant-requests',
        referenceId: consultantData.id,
        type: 'consultant'
      });

      this.broadcastToClients(notification.toJSON());
      console.log('✅ Consultant notification created and broadcast');
    } catch (error) {
      console.error('Error creating consultant notification:', error);
    }
  }

  /**
   * Handle community member created event
   */
  async handleCommunityCreated(communityData) {
    try {
      const notification = await Notification.create({
        title: 'New Community Member Request',
        message: `${communityData.name} from ${communityData.company} applied to join the consultant community`,
        route: '/api/consultant-community/submit',
        targetRoute: '/admin/community',
        referenceId: communityData.id,
        type: 'community'
      });

      this.broadcastToClients(notification.toJSON());
      console.log('✅ Community notification created and broadcast');
    } catch (error) {
      console.error('Error creating community notification:', error);
    }
  }

  /**
   * Add SSE client connection
   * @param {number} userId - User ID
   * @param {Object} res - Express response object
   */
  addClient(userId, res) {
    // Remove existing connection for this user if any
    this.removeClient(userId);
    
    // Get origin from request for CORS (supports both dev and production)
    const origin = res.req.headers.origin || 'https://beyond-border.org';
    
    // Setup SSE headers optimized for LiteSpeed/cPanel shared hosting
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Connection': 'keep-alive',
      'Keep-Alive': 'timeout=300, max=100', // 5 minute timeout for shared hosting
      'X-Accel-Buffering': 'no', // Disable nginx/LiteSpeed buffering
      'Transfer-Encoding': 'chunked', // Enable chunked transfer for streaming
      'Access-Control-Allow-Origin': origin, // Dynamic CORS origin
      'Access-Control-Allow-Credentials': 'true', // Allow credentials
      'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept, Origin', // Allowed headers
      'Access-Control-Expose-Headers': 'Content-Type, Cache-Control' // Expose headers
    });

    // Store connection with metadata
    const connectionTime = Date.now();
    this.connections.set(userId, {
      response: res,
      lastHeartbeat: connectionTime,
      connectedAt: connectionTime
    });

    console.log(`📡 SSE client connected: User ${userId} (Total connections: ${this.connections.size})`);
    console.log(`📊 Connection details: Origin=${origin}, UserAgent=${res.req.headers['user-agent']?.substring(0, 50)}...`);

    // Send initial connection confirmation
    this.sendToClient(userId, {
      type: 'connected',
      message: 'SSE connection established successfully',
      timestamp: new Date().toISOString()
    });

    // Handle client disconnect
    res.on('close', () => {
      const connection = this.connections.get(userId);
      const duration = connection ? Math.round((Date.now() - connection.connectedAt) / 1000) : 0;
      this.removeClient(userId);
      console.log(`📡 SSE client disconnected: User ${userId} (Connected for ${duration}s, Remaining: ${this.connections.size})`);
    });

    // Handle connection errors
    res.on('error', (error) => {
      console.error(`❌ SSE connection error for user ${userId}:`, error.message);
      this.removeClient(userId);
    });
  }

  /**
   * Remove SSE client connection
   * @param {number} userId - User ID
   */
  removeClient(userId) {
    const connection = this.connections.get(userId);
    if (connection) {
      try {
        connection.response.end();
      } catch (error) {
        // Connection already closed
      }
      this.connections.delete(userId);
    }
  }

  /**
   * Send event to specific client
   * @param {number} userId - User ID
   * @param {Object} data - Data to send
   */
  sendToClient(userId, data) {
    const connection = this.connections.get(userId);
    if (connection) {
      try {
        connection.response.write(`data: ${JSON.stringify(data)}\n\n`);
        connection.lastHeartbeat = Date.now();
        return true;
      } catch (error) {
        console.error(`Error sending to client ${userId}:`, error.message);
        this.removeClient(userId);
        return false;
      }
    }
    return false;
  }

  /**
   * Broadcast notification to all connected clients
   * @param {Object} notification - Notification data
   */
  broadcastToClients(notification) {
    let successCount = 0;
    let failCount = 0;

    this.connections.forEach((connection, userId) => {
      const sent = this.sendToClient(userId, {
        type: 'notification',
        data: notification,
        timestamp: new Date().toISOString()
      });

      if (sent) {
        successCount++;
      } else {
        failCount++;
      }
    });

    console.log(`📢 Broadcast notification: ${successCount} successful, ${failCount} failed`);
    return { successCount, failCount };
  }

  /**
   * Start heartbeat to keep connections alive and clean stale ones
   */
  startHeartbeat() {
    setInterval(() => {
      const now = Date.now();
      const timeout = 60000; // 60 seconds timeout

      this.connections.forEach((connection, userId) => {
        // Check if connection is stale
        if (now - connection.lastHeartbeat > timeout) {
          console.log(`⚠️ Removing stale connection for user ${userId}`);
          this.removeClient(userId);
        } else {
          // Send heartbeat
          this.sendToClient(userId, {
            type: 'heartbeat',
            timestamp: new Date().toISOString()
          });
        }
      });
    }, this.heartbeatInterval);
  }

  /**
   * Get connection stats
   */
  getStats() {
    return {
      activeConnections: this.connections.size,
      connections: Array.from(this.connections.keys())
    };
  }
}

// Export singleton instance
module.exports = new NotificationService();

