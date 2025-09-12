const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const ShiftAssignment = sequelize.define('ShiftAssignment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    shift_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'shifts',
        key: 'id'
      }
    },
    guard_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    assigned_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('assigned', 'accepted', 'rejected', 'active', 'completed', 'terminated', 'removed'),
      allowNull: false,
      defaultValue: 'assigned'
    },
    assigned_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    accepted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'shift_assignments',
    indexes: [
      {
        unique: true,
        fields: ['shift_id', 'guard_id'],
        name: 'unique_shift_guard_assignment'
      },
      {
        fields: ['shift_id']
      },
      {
        fields: ['guard_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['assigned_by']
      }
    ]
  });

  ShiftAssignment.associate = (models) => {
    ShiftAssignment.belongsTo(models.Shift, {
      foreignKey: 'shift_id',
      as: 'shift'
    });

    ShiftAssignment.belongsTo(models.User, {
      foreignKey: 'guard_id',
      as: 'guard'
    });

    ShiftAssignment.belongsTo(models.User, {
      foreignKey: 'assigned_by',
      as: 'assignedBy'
    });
  };

  return ShiftAssignment;
};