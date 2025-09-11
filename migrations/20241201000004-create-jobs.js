'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jobs', {
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
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      date: {
        type: Sequelize.DATEONLY,
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
      hourly_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      total_hours: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      required_guards: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      hired_guards: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      status: {
        type: Sequelize.ENUM('open', 'hiring', 'hired', 'in_progress', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'open'
      },
      requirements: {
        type: Sequelize.JSON,
        allowNull: true
      },
      special_instructions: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      total_budget: {
        type: Sequelize.DECIMAL(12, 2),
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

    await queryInterface.addIndex('jobs', ['company_id']);
    await queryInterface.addIndex('jobs', ['date']);
    await queryInterface.addIndex('jobs', ['status']);
    await queryInterface.addIndex('jobs', ['hourly_rate']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('jobs');
  }
};