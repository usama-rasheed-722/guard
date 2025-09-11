'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('guard_profiles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other'),
        allowNull: true
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      zip_code: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      experience_years: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      hourly_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      availability: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_armed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      license_number: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      license_expiry: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      certificates: {
        type: Sequelize.JSON,
        allowNull: true
      },
      skills: {
        type: Sequelize.JSON,
        allowNull: true
      },
      languages: {
        type: Sequelize.JSON,
        allowNull: true
      },
      profile_picture: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      verification_status: {
        type: Sequelize.ENUM('pending', 'verified', 'rejected'),
        defaultValue: 'pending'
      },
      verification_documents: {
        type: Sequelize.JSON,
        allowNull: true
      },
      rating: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: true,
        defaultValue: 0.00
      },
      total_ratings: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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

    await queryInterface.addIndex('guard_profiles', ['user_id'], { unique: true });
    await queryInterface.addIndex('guard_profiles', ['availability']);
    await queryInterface.addIndex('guard_profiles', ['is_armed']);
    await queryInterface.addIndex('guard_profiles', ['verification_status']);
    await queryInterface.addIndex('guard_profiles', ['rating']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('guard_profiles');
  }
};