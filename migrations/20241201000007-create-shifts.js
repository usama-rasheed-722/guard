'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shifts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      company_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      guard_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      company_location_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'company_locations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      location_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: false
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: false
      },
      start_time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      end_time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      days_of_week: {
        type: Sequelize.JSON,
        allowNull: false
      },
      hourly_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      extra_hours: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0
      },
      status: {
        type: Sequelize.ENUM('open', 'assigned', 'active', 'terminated', 'resigned', 'completed'),
        allowNull: false,
        defaultValue: 'open'
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      requirements: {
        type: Sequelize.JSON,
        allowNull: true
      },
      special_instructions: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('shifts', ['company_id']);
    await queryInterface.addIndex('shifts', ['guard_id']);
    await queryInterface.addIndex('shifts', ['company_location_id']);
    await queryInterface.addIndex('shifts', ['status']);
    await queryInterface.addIndex('shifts', ['start_date']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('shifts');
  }
};