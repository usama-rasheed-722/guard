'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendance_pings', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      guard_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
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
      latitude: { type: Sequelize.DECIMAL(10, 8), allowNull: false },
      longitude: { type: Sequelize.DECIMAL(11, 8), allowNull: false },
      pinged_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });

    await queryInterface.addIndex('attendance_pings', ['guard_id']);
    await queryInterface.addIndex('attendance_pings', ['job_id']);
    await queryInterface.addIndex('attendance_pings', ['shift_id']);
    await queryInterface.addIndex('attendance_pings', ['pinged_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('attendance_pings');
  }
};

