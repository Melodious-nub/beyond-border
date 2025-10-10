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
          ? 'https://api.beyondborderconsultant.com' 
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
        },
        SendNotificationRequest: {
          type: 'object',
          required: ['subject', 'message'],
          properties: {
            subject: {
              type: 'string',
              description: 'Email subject line',
              example: 'System Alert',
              minLength: 1,
              maxLength: 200
            },
            message: {
              type: 'string',
              description: 'Email message content',
              example: 'This is a system notification message.',
              minLength: 1,
              maxLength: 2000
            }
          }
        },
        SendNotificationResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Notification sent to 3 email addresses'
            },
            data: {
              type: 'object',
              properties: {
                sentCount: {
                  type: 'integer',
                  example: 3
                },
                failedCount: {
                  type: 'integer',
                  example: 0
                },
                totalConfigured: {
                  type: 'integer',
                  example: 3
                }
              }
            }
          }
        },
        Page: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Page ID',
              example: 1
            },
            page: {
              type: 'string',
              description: 'Page slug (URL-friendly identifier)',
              example: 'about',
              minLength: 2,
              maxLength: 100
            },
            pageTitle: {
              type: 'string',
              description: 'Page title for display',
              example: 'About Beyond Border Consultants',
              minLength: 2,
              maxLength: 200
            },
            pageDescription: {
              type: 'string',
              description: 'Page description/meta description',
              example: 'Beyond Border Consultants is a multidisciplinary advisory firm dedicated to empowering NGOs, development agencies, and public-private partnerships through strategic consultancy services.',
              minLength: 10,
              maxLength: 2000
            },
            bgColor: {
              type: 'string',
              description: 'Background color in hex format',
              example: '#ffffff',
              pattern: '^#[0-9A-Fa-f]{6}$'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the page is active',
              example: true,
              default: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Page creation timestamp',
              example: '2024-01-01T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Page last update timestamp',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        },
        PageCreationRequest: {
          type: 'object',
          required: ['page', 'pageTitle', 'pageDescription'],
          properties: {
            page: {
              type: 'string',
              description: 'Page slug',
              example: 'about'
            },
            pageTitle: {
              type: 'string',
              description: 'Page title',
              example: 'About Beyond Border Consultants'
            },
            pageDescription: {
              type: 'string',
              description: 'Page description',
              example: 'Beyond Border Consultants is a multidisciplinary advisory firm...'
            },
            bgColor: {
              type: 'string',
              description: 'Background color',
              example: '#ffffff'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the page is active',
              example: true
            }
          }
        },
        PageUpdateRequest: {
          type: 'object',
          properties: {
            page: {
              type: 'string',
              description: 'Page slug',
              example: 'about-updated'
            },
            pageTitle: {
              type: 'string',
              description: 'Page title',
              example: 'About Beyond Border Consultants - Updated'
            },
            pageDescription: {
              type: 'string',
              description: 'Page description',
              example: 'Updated description for Beyond Border Consultants...'
            },
            bgColor: {
              type: 'string',
              description: 'Background color',
              example: '#f8f9fa'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the page is active',
              example: true
            }
          }
        },
        PageResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Page retrieved successfully'
            },
            data: {
              type: 'object',
              properties: {
                page: {
                  $ref: '#/components/schemas/Page'
                }
              }
            }
          }
        },
        PageListResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Pages retrieved successfully'
            },
            data: {
              type: 'object',
              properties: {
                pages: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Page'
                  }
                }
              }
            }
          }
        },
        Breadcrumb: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Breadcrumb ID',
              example: 1
            },
            pageId: {
              type: 'integer',
              description: 'Associated page ID',
              example: 1
            },
            page: {
              type: 'string',
              description: 'Page slug',
              example: 'about',
              minLength: 2,
              maxLength: 100
            },
            pageTitle: {
              type: 'string',
              description: 'Page title for breadcrumb',
              example: 'About Beyond Border Consultants',
              minLength: 2,
              maxLength: 200
            },
            pageDescription: {
              type: 'string',
              description: 'Page description for breadcrumb',
              example: 'Beyond Border Consultants is a multidisciplinary advisory firm dedicated to empowering NGOs, development agencies, and public-private partnerships through strategic consultancy services.',
              minLength: 10,
              maxLength: 2000
            },
            bgColor: {
              type: 'string',
              description: 'Background color in hex format',
              example: '#ffffff',
              pattern: '^#[0-9A-Fa-f]{6}$'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Breadcrumb creation timestamp',
              example: '2024-01-01T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Breadcrumb last update timestamp',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        },
        BreadcrumbCreationRequest: {
          type: 'object',
          required: ['pageId', 'page', 'pageTitle', 'pageDescription'],
          properties: {
            pageId: {
              type: 'integer',
              description: 'Associated page ID',
              example: 1
            },
            page: {
              type: 'string',
              description: 'Page slug',
              example: 'about'
            },
            pageTitle: {
              type: 'string',
              description: 'Page title',
              example: 'About Beyond Border Consultants'
            },
            pageDescription: {
              type: 'string',
              description: 'Page description',
              example: 'Beyond Border Consultants is a multidisciplinary advisory firm...'
            },
            bgColor: {
              type: 'string',
              description: 'Background color',
              example: '#ffffff'
            }
          }
        },
        BreadcrumbUpdateRequest: {
          type: 'object',
          properties: {
            page: {
              type: 'string',
              description: 'Page slug',
              example: 'about-updated'
            },
            pageTitle: {
              type: 'string',
              description: 'Page title',
              example: 'About Beyond Border Consultants - Updated'
            },
            pageDescription: {
              type: 'string',
              description: 'Page description',
              example: 'Updated description for Beyond Border Consultants...'
            },
            bgColor: {
              type: 'string',
              description: 'Background color',
              example: '#f8f9fa'
            }
          }
        },
        BreadcrumbResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Breadcrumb retrieved successfully'
            },
            data: {
              type: 'object',
              properties: {
                breadcrumb: {
                  $ref: '#/components/schemas/Breadcrumb'
                }
              }
            }
          }
        },
        BreadcrumbListResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Breadcrumbs retrieved successfully'
            },
            data: {
              type: 'object',
              properties: {
                breadcrumbs: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Breadcrumb'
                  }
                }
              }
            }
          }
        },
        PageDataResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Page data retrieved successfully'
            },
            data: {
              type: 'object',
              properties: {
                pageData: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      page: {
                        type: 'string',
                        example: 'about'
                      },
                      pageTitle: {
                        type: 'string',
                        example: 'About Beyond Border Consultants'
                      },
                      pageDescription: {
                        type: 'string',
                        example: 'Beyond Border Consultants is a multidisciplinary advisory firm...'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        Consultant: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Consultant request ID',
              example: 1
            },
            ngoName: {
              type: 'string',
              description: 'NGO name',
              example: 'Green Earth Foundation'
            },
            ngoRegistrationNumber: {
              type: 'string',
              description: 'NGO registration number',
              example: 'REG-2024-001'
            },
            chairmanPresidentName: {
              type: 'string',
              description: 'Chairman or President name',
              example: 'Dr. Sarah Johnson'
            },
            specializedAreas: {
              type: 'string',
              description: 'Specialized areas of operation',
              example: 'Environmental conservation, climate resilience, sustainable agriculture'
            },
            planningToExpand: {
              type: 'boolean',
              description: 'Whether planning to expand operations',
              example: true
            },
            expansionRegions: {
              type: 'string',
              description: 'Regions for expansion',
              example: 'East Africa, South Asia'
            },
            needFundingSupport: {
              type: 'boolean',
              description: 'Whether needs funding support',
              example: true
            },
            totalFundRequired: {
              type: 'number',
              description: 'Total fund required in USD',
              example: 500000.00
            },
            lookingForFundManager: {
              type: 'boolean',
              description: 'Whether looking for fund manager',
              example: false
            },
            openToSplittingInvestment: {
              type: 'boolean',
              description: 'Whether open to splitting investment',
              example: true
            },
            hasSpecializedTeam: {
              type: 'boolean',
              description: 'Whether has specialized team for proposals',
              example: false
            },
            needAssistance: {
              type: 'boolean',
              description: 'Whether needs assistance with proposals',
              example: true
            },
            emailAddress: {
              type: 'string',
              description: 'Email address',
              example: 'contact@greenearth.org'
            },
            websiteAddress: {
              type: 'string',
              description: 'Website address',
              example: 'https://www.greenearth.org'
            },
            phoneNumber: {
              type: 'string',
              description: 'Phone number',
              example: '+1-555-0123'
            },
            status: {
              type: 'string',
              enum: ['new', 'read', 'contacted', 'closed'],
              description: 'Request status',
              example: 'new'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
              example: '2024-01-01T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        },
        ConsultantRequest: {
          type: 'object',
          required: ['ngoName', 'ngoRegistrationNumber', 'chairmanPresidentName', 'specializedAreas', 'planningToExpand', 'needFundingSupport', 'openToSplittingInvestment', 'hasSpecializedTeam', 'emailAddress', 'phoneNumber'],
          properties: {
            ngoName: {
              type: 'string',
              description: 'NGO name',
              example: 'Green Earth Foundation',
              minLength: 2,
              maxLength: 255
            },
            ngoRegistrationNumber: {
              type: 'string',
              description: 'NGO registration number',
              example: 'REG-2024-001',
              minLength: 2,
              maxLength: 100
            },
            chairmanPresidentName: {
              type: 'string',
              description: 'Chairman or President name',
              example: 'Dr. Sarah Johnson',
              minLength: 2,
              maxLength: 255
            },
            specializedAreas: {
              type: 'array',
              items: {
                type: 'string',
                minLength: 2,
                maxLength: 100
              },
              description: 'Specialized areas of operation',
              example: ['Environmental conservation', 'Climate resilience', 'Sustainable agriculture'],
              minItems: 1
            },
            planningToExpand: {
              type: 'boolean',
              description: 'Whether planning to expand operations',
              example: true
            },
            expansionRegions: {
              type: 'array',
              items: {
                type: 'string',
                minLength: 2,
                maxLength: 100
              },
              description: 'Regions for expansion (required if planningToExpand is true)',
              example: ['East Africa', 'South Asia']
            },
            needFundingSupport: {
              type: 'boolean',
              description: 'Whether needs funding support',
              example: true
            },
            totalFundRequired: {
              type: 'number',
              description: 'Total fund required in USD (required if needFundingSupport is true)',
              example: 500000.00
            },
            lookingForFundManager: {
              type: 'boolean',
              description: 'Whether looking for fund manager (required if needFundingSupport is true)',
              example: false
            },
            openToSplittingInvestment: {
              type: 'boolean',
              description: 'Whether open to splitting investment',
              example: true
            },
            hasSpecializedTeam: {
              type: 'boolean',
              description: 'Whether has specialized team for proposals',
              example: false
            },
            needAssistance: {
              type: 'boolean',
              description: 'Whether needs assistance with proposals (required if hasSpecializedTeam is false)',
              example: true
            },
            emailAddress: {
              type: 'string',
              format: 'email',
              description: 'Email address',
              example: 'contact@greenearth.org'
            },
            websiteAddress: {
              type: 'string',
              format: 'uri',
              description: 'Website address (optional)',
              example: 'https://www.greenearth.org'
            },
            phoneNumber: {
              type: 'string',
              description: 'Phone number',
              example: '+1-555-0123',
              minLength: 5,
              maxLength: 50
            }
          }
        },
        ConsultantResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Consultant request submitted successfully'
            },
            data: {
              type: 'object',
              properties: {
                consultant: {
                  $ref: '#/components/schemas/Consultant'
                }
              }
            }
          }
        },
        ConsultantListResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Consultant requests retrieved successfully'
            },
            data: {
              type: 'object',
              properties: {
                consultants: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Consultant'
                  }
                },
                pagination: {
                  type: 'object',
                  properties: {
                    page: {
                      type: 'integer',
                      example: 1
                    },
                    pageSize: {
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
        TeamMember: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Team member ID',
              example: 1
            },
            name: {
              type: 'string',
              description: 'Team member name',
              example: 'John Doe',
              minLength: 2,
              maxLength: 100
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Team member email',
              example: 'john@example.com'
            },
            avatar: {
              type: 'string',
              description: 'Team member avatar direct URL',
              example: 'http://localhost:3000/uploads/avatars/avatar-1234567890-123456789.jpg'
            },
            designation: {
              type: 'string',
              description: 'Team member designation',
              example: 'Senior Developer',
              minLength: 2,
              maxLength: 100
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              description: 'Team member status',
              example: 'active',
              default: 'active'
            },
            isManagement: {
              type: 'boolean',
              description: 'Whether the member is in management',
              example: false,
              default: false
            },
            phoneNumber: {
              type: 'string',
              description: 'Team member phone number',
              example: '+1-555-0123'
            },
            department: {
              type: 'string',
              description: 'Team member department',
              example: 'Engineering',
              maxLength: 100
            },
            linkedinUrl: {
              type: 'string',
              format: 'uri',
              description: 'LinkedIn profile URL',
              example: 'https://linkedin.com/in/johndoe'
            },
            facebookUrl: {
              type: 'string',
              format: 'uri',
              description: 'Facebook profile URL',
              example: 'https://facebook.com/johndoe'
            },
            twitterUrl: {
              type: 'string',
              format: 'uri',
              description: 'Twitter/X profile URL',
              example: 'https://twitter.com/johndoe'
            },
            instagramUrl: {
              type: 'string',
              format: 'uri',
              description: 'Instagram profile URL',
              example: 'https://instagram.com/johndoe'
            },
            redditUrl: {
              type: 'string',
              format: 'uri',
              description: 'Reddit profile URL',
              example: 'https://reddit.com/u/johndoe'
            },
            description: {
              type: 'string',
              description: 'Team member description',
              example: 'Experienced developer with 5+ years in web technologies',
              maxLength: 1000
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Team member creation timestamp',
              example: '2024-01-01T00:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Team member last update timestamp',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        },
        TeamMemberCreationRequest: {
          type: 'object',
          required: ['name', 'email', 'designation'],
          properties: {
            name: {
              type: 'string',
              description: 'Team member name',
              example: 'John Doe',
              minLength: 2,
              maxLength: 100
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Team member email',
              example: 'john@example.com'
            },
            avatar: {
              type: 'string',
              description: 'Team member avatar direct URL',
              example: 'http://localhost:3000/uploads/avatars/avatar-1234567890-123456789.jpg'
            },
            designation: {
              type: 'string',
              description: 'Team member designation',
              example: 'Senior Developer',
              minLength: 2,
              maxLength: 100
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              description: 'Team member status',
              example: 'active',
              default: 'active'
            },
            isManagement: {
              type: 'boolean',
              description: 'Whether the member is in management',
              example: false,
              default: false
            },
            phoneNumber: {
              type: 'string',
              description: 'Team member phone number',
              example: '+1-555-0123'
            },
            department: {
              type: 'string',
              description: 'Team member department',
              example: 'Engineering',
              maxLength: 100
            },
            linkedinUrl: {
              type: 'string',
              format: 'uri',
              description: 'LinkedIn profile URL',
              example: 'https://linkedin.com/in/johndoe'
            },
            facebookUrl: {
              type: 'string',
              format: 'uri',
              description: 'Facebook profile URL',
              example: 'https://facebook.com/johndoe'
            },
            twitterUrl: {
              type: 'string',
              format: 'uri',
              description: 'Twitter/X profile URL',
              example: 'https://twitter.com/johndoe'
            },
            instagramUrl: {
              type: 'string',
              format: 'uri',
              description: 'Instagram profile URL',
              example: 'https://instagram.com/johndoe'
            },
            redditUrl: {
              type: 'string',
              format: 'uri',
              description: 'Reddit profile URL',
              example: 'https://reddit.com/u/johndoe'
            },
            description: {
              type: 'string',
              description: 'Team member description',
              example: 'Experienced developer with 5+ years in web technologies',
              maxLength: 1000
            }
          }
        },
        TeamMemberUpdateRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Team member name',
              example: 'John Updated Doe',
              minLength: 2,
              maxLength: 100
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Team member email',
              example: 'john.updated@example.com'
            },
            avatar: {
              type: 'string',
              description: 'Team member avatar URL',
              example: 'https://example.com/avatar-updated.jpg'
            },
            designation: {
              type: 'string',
              description: 'Team member designation',
              example: 'Lead Developer',
              minLength: 2,
              maxLength: 100
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              description: 'Team member status',
              example: 'active'
            },
            isManagement: {
              type: 'boolean',
              description: 'Whether the member is in management',
              example: true
            },
            phoneNumber: {
              type: 'string',
              description: 'Team member phone number',
              example: '+1-555-0124'
            },
            department: {
              type: 'string',
              description: 'Team member department',
              example: 'Engineering',
              maxLength: 100
            },
            linkedinUrl: {
              type: 'string',
              format: 'uri',
              description: 'LinkedIn profile URL',
              example: 'https://linkedin.com/in/johndoe'
            },
            facebookUrl: {
              type: 'string',
              format: 'uri',
              description: 'Facebook profile URL',
              example: 'https://facebook.com/johndoe'
            },
            twitterUrl: {
              type: 'string',
              format: 'uri',
              description: 'Twitter/X profile URL',
              example: 'https://twitter.com/johndoe'
            },
            instagramUrl: {
              type: 'string',
              format: 'uri',
              description: 'Instagram profile URL',
              example: 'https://instagram.com/johndoe'
            },
            redditUrl: {
              type: 'string',
              format: 'uri',
              description: 'Reddit profile URL',
              example: 'https://reddit.com/u/johndoe'
            },
            description: {
              type: 'string',
              description: 'Team member description',
              example: 'Lead developer with 8+ years in web technologies',
              maxLength: 1000
            }
          }
        },
        TeamMemberResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Team member retrieved successfully'
            },
            data: {
              type: 'object',
              properties: {
                teamMember: {
                  $ref: '#/components/schemas/TeamMember'
                }
              }
            }
          }
        },
        TeamMemberListResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Team members retrieved successfully'
            },
            data: {
              type: 'object',
              properties: {
                teams: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/TeamMember'
                  }
                },
                pagination: {
                  type: 'object',
                  properties: {
                    page: {
                      type: 'integer',
                      example: 1
                    },
                    pageSize: {
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
        TeamMemberPublicListResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Active team members retrieved successfully'
            },
            data: {
              type: 'object',
              properties: {
                teamMembers: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'integer',
                        example: 1
                      },
                      name: {
                        type: 'string',
                        example: 'John Doe'
                      },
                      email: {
                        type: 'string',
                        example: 'john@example.com'
                      },
                      avatar: {
                        type: 'string',
                        example: 'https://example.com/avatar.jpg'
                      },
                      designation: {
                        type: 'string',
                        example: 'Senior Developer'
                      },
                      isManagement: {
                        type: 'boolean',
                        example: false
                      },
                      phoneNumber: {
                        type: 'string',
                        example: '+1-555-0123'
                      },
                      department: {
                        type: 'string',
                        example: 'Engineering'
                      },
                      linkedinUrl: {
                        type: 'string',
                        example: 'https://linkedin.com/in/johndoe'
                      },
                      facebookUrl: {
                        type: 'string',
                        example: 'https://facebook.com/johndoe'
                      },
                      twitterUrl: {
                        type: 'string',
                        example: 'https://twitter.com/johndoe'
                      },
                      instagramUrl: {
                        type: 'string',
                        example: 'https://instagram.com/johndoe'
                      },
                      redditUrl: {
                        type: 'string',
                        example: 'https://reddit.com/u/johndoe'
                      },
                      description: {
                        type: 'string',
                        example: 'Experienced developer with 5+ years in web technologies'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        TeamStatsResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Team statistics retrieved successfully'
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
                    active: {
                      type: 'integer',
                      example: 20
                    },
                    management: {
                      type: 'integer',
                      example: 5
                    },
                    departments: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          department: {
                            type: 'string',
                            example: 'Engineering'
                          },
                          count: {
                            type: 'integer',
                            example: 10
                          }
                        }
                      }
                    }
                  }
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
