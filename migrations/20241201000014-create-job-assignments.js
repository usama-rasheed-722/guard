'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('job_assignments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      job_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'jobs', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      guard_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      assigned_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('assigned', 'active', 'completed', 'terminated', 'removed'),
        allowNull: false,
        defaultValue: 'assigned'
      },
      assigned_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
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

    await queryInterface.addConstraint('job_assignments', {
      fields: ['job_id', 'guard_id'],
      type: 'unique',
      name: 'unique_job_guard_assignment'
    });

    await queryInterface.addIndex('job_assignments', ['job_id']);
    await queryInterface.addIndex('job_assignments', ['guard_id']);
    await queryInterface.addIndex('job_assignments', ['status']);
    await queryInterface.addIndex('job_assignments', ['assigned_by']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('job_assignments');
  }
};

