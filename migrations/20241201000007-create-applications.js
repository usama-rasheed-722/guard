'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('applications', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      guard_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      job_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'jobs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      shift_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'shifts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('applied', 'accepted', 'rejected', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'applied'
      },
      bid_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      cover_letter: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      applied_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      responded_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      notes: {
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

    await queryInterface.addIndex('applications', ['guard_id']);
    await queryInterface.addIndex('applications', ['job_id']);
    await queryInterface.addIndex('applications', ['shift_id']);
    await queryInterface.addIndex('applications', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('applications');
  }
};