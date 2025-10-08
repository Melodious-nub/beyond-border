const { pool } = require('../config/database');

class Breadcrumb {
  constructor(data) {
    this.id = data.id;
    this.pageId = data.pageId;
    this.page = data.page;
    this.pageTitle = data.pageTitle;
    this.pageDescription = data.pageDescription;
    this.bgColor = data.bgColor || '#ffffff';
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Create or update breadcrumb for a page (one breadcrumb per page)
  static async createOrUpdate(breadcrumbData) {
    try {
      const { page, pageTitle, pageDescription, bgColor = '#ffffff' } = breadcrumbData;
      
      // Check if breadcrumb already exists for this page
      const existingBreadcrumb = await Breadcrumb.findByPage(page);
      
      if (existingBreadcrumb) {
        // Update existing breadcrumb
        await existingBreadcrumb.update({
          pageTitle,
          pageDescription,
          bgColor
        });
        return existingBreadcrumb;
      } else {
        // Create new breadcrumb
        const [result] = await pool.execute(
          'INSERT INTO breadcrumbs (page, pageTitle, pageDescription, bgColor) VALUES (?, ?, ?, ?)',
          [page, pageTitle, pageDescription, bgColor]
        );
        
        // Return the created breadcrumb object
        const [rows] = await pool.execute(
          'SELECT * FROM breadcrumbs WHERE id = ?',
          [result.insertId]
        );
        
        return new Breadcrumb(rows[0]);
      }
    } catch (error) {
      throw error;
    }
  }

  // Find breadcrumb by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM breadcrumbs WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? new Breadcrumb(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find breadcrumb by page name
  static async findByPage(page) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM breadcrumbs WHERE page = ?',
        [page]
      );
      
      return rows.length > 0 ? new Breadcrumb(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }


  // Get all breadcrumbs
  static async findAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM breadcrumbs ORDER BY page ASC'
      );
      
      return rows.map(row => new Breadcrumb(row));
    } catch (error) {
      throw error;
    }
  }

  // Get all breadcrumbs for frontend
  static async findAllForFrontend() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM breadcrumbs ORDER BY page ASC'
      );
      
      return rows.map(row => new Breadcrumb(row));
    } catch (error) {
      throw error;
    }
  }

  // Get breadcrumb data for frontend (pageData format)
  static async getPageData() {
    try {
      const breadcrumbs = await Breadcrumb.findAllForFrontend();
      
      return breadcrumbs.map(breadcrumb => ({
        page: breadcrumb.page,
        pageTitle: breadcrumb.pageTitle,
        pageDescription: breadcrumb.pageDescription
      }));
    } catch (error) {
      throw error;
    }
  }

  // Update breadcrumb
  async update(updateData) {
    try {
      const { pageTitle, pageDescription, bgColor } = updateData;
      
      await pool.execute(
        'UPDATE breadcrumbs SET pageTitle = ?, pageDescription = ?, bgColor = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [pageTitle, pageDescription, bgColor, this.id]
      );

      // Update local instance
      this.pageTitle = pageTitle;
      this.pageDescription = pageDescription;
      this.bgColor = bgColor;
      return this;
    } catch (error) {
      throw error;
    }
  }

  // Delete breadcrumb
  async delete() {
    try {
      await pool.execute('DELETE FROM breadcrumbs WHERE id = ?', [this.id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Delete breadcrumb by page ID (when page is deleted)
  static async deleteByPage(page) {
    try {
      await pool.execute('DELETE FROM breadcrumbs WHERE page = ?', [page]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get breadcrumb data
  toJSON() {
    return {
      id: this.id,
      page: this.page,
      pageTitle: this.pageTitle,
      pageDescription: this.pageDescription,
      bgColor: this.bgColor,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Get breadcrumb data for frontend
  toPageDataJSON() {
    return {
      page: this.page,
      pageTitle: this.pageTitle,
      pageDescription: this.pageDescription
    };
  }
}

module.exports = Breadcrumb;
