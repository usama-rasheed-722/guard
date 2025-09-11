const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Shift = sequelize.define('Shift', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    company_location_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'company_locations',
        key: 'id'
      }
    },
    company_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    guard_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    days_of_week: {
      type: DataTypes.JSON,
      allowNull: false
    },
    hourly_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    extra_hours: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('open', 'assigned', 'active', 'terminated', 'resigned', 'completed'),
      allowNull: false,
      defaultValue: 'open'
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    requirements: {
      type: DataTypes.JSON,
      allowNull: true
    },
    special_instructions: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'shifts',
    indexes: [
      {
        fields: ['company_id']
      },
      {
        fields: ['guard_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['start_date']
      }
    ]
  });

  Shift.associate = (models) => {
    Shift.belongsTo(models.User, {
      foreignKey: 'company_id',
      as: 'company'
    });

    Shift.belongsTo(models.CompanyLocation, {
      foreignKey: 'company_location_id',
      as: 'companyLocation'
    });

    Shift.belongsTo(models.User, {
      foreignKey: 'guard_id',
      as: 'guard'
    });

    Shift.hasMany(models.Application, {
      foreignKey: 'shift_id',
      as: 'applications'
    });

    Shift.hasMany(models.Attendance, {
      foreignKey: 'shift_id',
      as: 'attendance'
    });

    Shift.hasMany(models.Transaction, {
      foreignKey: 'shift_id',
      as: 'transactions'
    });
  };

  return Shift;
};