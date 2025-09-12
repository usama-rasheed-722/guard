const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [6, 255]
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('admin', 'agency', 'guard'),
      allowNull: false,
      defaultValue: 'guard'
    },
    status: {
      type: DataTypes.ENUM('active', 'suspended', 'pending'),
      allowNull: false,
      defaultValue: 'pending'
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    phone_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'users',
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        fields: ['role']
      },
      {
        fields: ['status']
      }
    ]
  });

  User.associate = (models) => {
    // User has one CompanyProfile (if role is agency)
    User.hasOne(models.CompanyProfile, {
      foreignKey: 'user_id',
      as: 'companyProfile'
    });

    // User has one GuardProfile (if role is guard)
    User.hasOne(models.GuardProfile, {
      foreignKey: 'user_id',
      as: 'guardProfile'
    });

    // User has many Jobs (as company)
    User.hasMany(models.Job, {
      foreignKey: 'company_id',
      as: 'jobs'
    });

    // User has many Shifts (as company)
    User.hasMany(models.Shift, {
      foreignKey: 'company_id',
      as: 'companyShifts'
    });


    // User has many Applications (as guard)
    User.hasMany(models.Application, {
      foreignKey: 'guard_id',
      as: 'applications'
    });

    // User has many Attendance records
    User.hasMany(models.Attendance, {
      foreignKey: 'guard_id',
      as: 'attendance'
    });

    // User has one Wallet
    User.hasOne(models.Wallet, {
      foreignKey: 'user_id',
      as: 'wallet'
    });

    // User has many Transactions (as sender)
    User.hasMany(models.Transaction, {
      foreignKey: 'from_user_id',
      as: 'sentTransactions'
    });

    // User has many Transactions (as receiver)
    User.hasMany(models.Transaction, {
      foreignKey: 'to_user_id',
      as: 'receivedTransactions'
    });

    // User has many CompanyLocations (if role is agency)
    User.hasMany(models.CompanyLocation, {
      foreignKey: 'company_id',
      as: 'locations'
    });

    // User has many Feedback (as sender)
    User.hasMany(models.Feedback, {
      foreignKey: 'from_user_id',
      as: 'sentFeedback'
    });

    // User has many Feedback (as receiver)
    User.hasMany(models.Feedback, {
      foreignKey: 'to_user_id',
      as: 'receivedFeedback'
    });
  };

  return User;
};