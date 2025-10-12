'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Add the column if it doesn't exist
    await queryInterface.addColumn('jobs', 'location_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'locations',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // Step 2: Remove the column if rolled back
    await queryInterface.removeColumn('jobs', 'location_id');
  }
};
