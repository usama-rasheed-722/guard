'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shift_assignments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      shift_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'shifts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      assigned_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('assigned', 'accepted', 'rejected', 'active', 'completed', 'terminated', 'removed'),
        allowNull: false,
        defaultValue: 'assigned'
      },
      assigned_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      accepted_at: {
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

    // Add unique constraint to prevent duplicate assignments
    await queryInterface.addIndex('shift_assignments', ['shift_id', 'guard_id'], {
      unique: true,
      name: 'unique_shift_guard_assignment'
    });

    // Add other indexes for performance
    await queryInterface.addIndex('shift_assignments', ['shift_id']);
    await queryInterface.addIndex('shift_assignments', ['guard_id']);
    await queryInterface.addIndex('shift_assignments', ['status']);
    await queryInterface.addIndex('shift_assignments', ['assigned_by']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('shift_assignments');
  }
};