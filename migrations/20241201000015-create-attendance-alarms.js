'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendance_alarms', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      job_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'jobs', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      shift_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'shifts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      interval_minutes: { type: Sequelize.INTEGER, allowNull: false },
      active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });

    await queryInterface.addIndex('attendance_alarms', ['job_id']);
    await queryInterface.addIndex('attendance_alarms', ['shift_id']);
    await queryInterface.addIndex('attendance_alarms', ['active']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('attendance_alarms');
  }
};

