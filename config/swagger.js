const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Beyond Border Backend API',
      version: '1.0.0',
      description: 'A professional Express.js backend API for website maintenance management with MySQL database integration.',
      contact: {
        name: 'API Support',
        email: 'support@beyondborder.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://your-production-domain.com' 
          : `http://localhost:${process.env.PORT || 3000}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['fullName', 'email', 'password'],
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
              example: 1
            },
            fullName: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe',
              minLength: 2,
              maxLength: 100
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john@example.com'
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              description: 'User role',
              example: 'admin',
              default: 'admin'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
              example: '2024-01-01T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['fullName', 'email', 'password'],
          properties: {
            fullName: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe',
              minLength: 2,
              maxLength: 100
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              description: 'User password (min 6 characters, must contain uppercase, lowercase, and number)',
              example: 'SecurePass123',
              minLength: 6
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              description: 'User role (optional, defaults to admin)',
              example: 'admin',
              default: 'admin'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              description: 'User password',
              example: 'SecurePass123'
            }
          }
        },
        UpdateProfileRequest: {
          type: 'object',
          properties: {
            fullName: {
              type: 'string',
              description: 'User full name',
              example: 'John Updated Doe',
              minLength: 2,
              maxLength: 100
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john.updated@example.com'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation successful'
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User'
                },
                token: {
                  type: 'string',
                  description: 'JWT token for authentication',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                }
              }
            }
          }
        },
        UserResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'User profile retrieved successfully'
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'email'
                  },
                  message: {
                    type: 'string',
                    example: 'Please provide a valid email address'
                  }
                }
              }
            }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Server is running'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            },
            environment: {
              type: 'string',
              example: 'development'
            }
          }
        },
        Contact: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Contact message ID',
              example: 1
            },
            name: {
              type: 'string',
              description: 'Contact person name',
              example: 'John Doe',
              minLength: 2,
              maxLength: 100
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Contact person email',
              example: 'john@example.com'
            },
            description: {
              type: 'string',
              description: 'Contact message description',
              example: 'I would like to discuss a potential project...',
              minLength: 10,
              maxLength: 2000
            },
            status: {
              type: 'string',
              enum: ['new', 'read', 'replied', 'closed'],
              description: 'Contact message status',
              example: 'new',
              default: 'new'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Contact message creation timestamp',
              example: '2024-01-01T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Contact message last update timestamp',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        },
        ContactFormRequest: {
          type: 'object',
          required: ['name', 'email', 'description'],
          properties: {
            name: {
              type: 'string',
              description: 'Contact person name',
              example: 'John Doe',
              minLength: 2,
              maxLength: 100
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Contact person email',
              example: 'john@example.com'
            },
            description: {
              type: 'string',
              description: 'Contact message description',
              example: 'I would like to discuss a potential project with your team. Please contact me at your earliest convenience.',
              minLength: 10,
              maxLength: 2000
            }
          }
        },
        ContactResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Contact message retrieved successfully'
            },
            data: {
              type: 'object',
              properties: {
                contact: {
                  $ref: '#/components/schemas/Contact'
                }
              }
            }
          }
        },
        ContactListResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Contact messages retrieved successfully'
            },
            data: {
              type: 'object',
              properties: {
                contacts: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Contact'
                  }
                },
                pagination: {
                  type: 'object',
                  properties: {
                    page: {
                      type: 'integer',
                      example: 1
                    },
                    limit: {
                      type: 'integer',
                      example: 10
                    },
                    total: {
                      type: 'integer',
                      example: 25
                    },
                    pages: {
                      type: 'integer',
                      example: 3
                    }
                  }
                }
              }
            }
          }
        },
        ContactStatsResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Contact statistics retrieved successfully'
            },
            data: {
              type: 'object',
              properties: {
                stats: {
                  type: 'object',
                  properties: {
                    total: {
                      type: 'integer',
                      example: 25
                    },
                    new: {
                      type: 'integer',
                      example: 5
                    },
                    read: {
                      type: 'integer',
                      example: 10
                    },
                    replied: {
                      type: 'integer',
                      example: 8
                    },
                    closed: {
                      type: 'integer',
                      example: 2
                    }
                  }
                },
                recentContacts: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Contact'
                  }
                }
              }
            }
          }
        },
        EmailTestResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Test email sent successfully'
            },
            data: {
              type: 'object',
              properties: {
                messageId: {
                  type: 'string',
                  example: '<message-id@example.com>'
                }
              }
            }
          }
        },
        NotificationEmail: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', format: 'email', example: 'admin@example.com' },
            createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
          }
        },
        NotificationEmailResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Notification email added successfully' },
            data: {
              type: 'object',
              properties: {
                notificationEmail: { $ref: '#/components/schemas/NotificationEmail' }
              }
            }
          }
        },
        NotificationEmailListResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Notification emails retrieved successfully' },
            data: {
              type: 'object',
              properties: {
                notificationEmails: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/NotificationEmail' }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './routes/*.js',
    './app.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};
