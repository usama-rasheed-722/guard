'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendance', {
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
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      check_in_time: {
        type: Sequelize.DATE,
        allowNull: true
      },
      check_out_time: {
        type: Sequelize.DATE,
        allowNull: true
      },
      check_in_photo: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      check_out_photo: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      check_in_latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true
      },
      check_in_longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true
      },
      check_out_latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true
      },
      check_out_longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true
      },
      hours_worked: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'checked_in', 'checked_out', 'no_show', 'late'),
        allowNull: false,
        defaultValue: 'pending'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      verified_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      verified_at: {
        type: Sequelize.DATE,
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

    await queryInterface.addIndex('attendance', ['guard_id']);
    await queryInterface.addIndex('attendance', ['job_id']);
    await queryInterface.addIndex('attendance', ['shift_id']);
    await queryInterface.addIndex('attendance', ['date']);
    await queryInterface.addIndex('attendance', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('attendance');
  }
};