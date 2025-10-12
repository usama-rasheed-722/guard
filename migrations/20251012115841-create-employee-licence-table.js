'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employee_licence', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'employee',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      licence_id: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      licence_front_pic: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      licence_back_pic: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      authority: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      type: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      issue_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      expiry: {
        type: Sequelize.DATE,
        allowNull: true
      },
      state_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'state',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('employee_licence');
  }
};
