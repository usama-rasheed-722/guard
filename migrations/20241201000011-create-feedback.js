'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('feedback', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      from_user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      comments: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      feedback_type: {
        type: Sequelize.ENUM('guard_to_company', 'company_to_guard'),
        allowNull: false
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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

    await queryInterface.addIndex('feedback', ['from_user_id']);
    await queryInterface.addIndex('feedback', ['to_user_id']);
    await queryInterface.addIndex('feedback', ['job_id']);
    await queryInterface.addIndex('feedback', ['shift_id']);
    await queryInterface.addIndex('feedback', ['rating']);
    await queryInterface.addIndex('feedback', ['feedback_type']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('feedback');
  }
};