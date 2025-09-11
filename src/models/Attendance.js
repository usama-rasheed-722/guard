const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    guard_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    job_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'jobs',
        key: 'id'
      }
    },
    shift_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'shifts',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    check_in_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    check_out_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    check_in_photo: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    check_out_photo: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    check_in_latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    check_in_longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    check_out_latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    check_out_longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    hours_worked: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'checked_in', 'checked_out', 'no_show', 'late'),
      allowNull: false,
      defaultValue: 'pending'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    verified_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    verified_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'attendance',
    indexes: [
      {
        fields: ['guard_id']
      },
      {
        fields: ['job_id']
      },
      {
        fields: ['shift_id']
      },
      {
        fields: ['date']
      },
      {
        fields: ['status']
      },
      {
        unique: true,
        fields: ['guard_id', 'job_id', 'date'],
        where: {
          job_id: {
            [sequelize.Sequelize.Op.ne]: null
          }
        }
      },
      {
        unique: true,
        fields: ['guard_id', 'shift_id', 'date'],
        where: {
          shift_id: {
            [sequelize.Sequelize.Op.ne]: null
          }
        }
      }
    ]
  });

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.User, {
      foreignKey: 'guard_id',
      as: 'guard'
    });

    Attendance.belongsTo(models.Job, {
      foreignKey: 'job_id',
      as: 'job'
    });

    Attendance.belongsTo(models.Shift, {
      foreignKey: 'shift_id',
      as: 'shift'
    });

    Attendance.belongsTo(models.User, {
      foreignKey: 'verified_by',
      as: 'verifier'
    });
  };

  return Attendance;
};