const EventEmitter = require('events');

/**
 * Singleton EventEmitter for application-wide events
 * This allows loose coupling between different parts of the application
 * 
 * Events:
 * - 'contact:created' - Emitted when a new contact is created
 * - 'consultant:created' - Emitted when a new consultant request is created
 * - 'community:created' - Emitted when a new community member request is created
 */
class AppEventEmitter extends EventEmitter {
  constructor() {
    super();
    console.log('📡 Event Emitter initialized');
  }
}

// Export singleton instance
module.exports = new AppEventEmitter();

