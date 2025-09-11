'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      from_user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      to_user_id: {
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
        onDelete: 'SET NULL'
      },
      shift_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'shifts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('deposit', 'escrow', 'release', 'withdrawal', 'refund', 'fee'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'success', 'failed', 'hold', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      reference_id: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      escrow_release_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      processed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      failure_reason: {
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

    await queryInterface.addIndex('transactions', ['from_user_id']);
    await queryInterface.addIndex('transactions', ['to_user_id']);
    await queryInterface.addIndex('transactions', ['job_id']);
    await queryInterface.addIndex('transactions', ['shift_id']);
    await queryInterface.addIndex('transactions', ['type']);
    await queryInterface.addIndex('transactions', ['status']);
    await queryInterface.addIndex('transactions', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  }
};