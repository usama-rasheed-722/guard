const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const JobAssignment = sequelize.define('JobAssignment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    job_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'jobs',
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
      type: DataTypes.ENUM('assigned', 'active', 'completed', 'terminated', 'removed'),
      allowNull: false,
      defaultValue: 'assigned'
    },
    assigned_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'job_assignments',
    indexes: [
      {
        unique: true,
        fields: ['job_id', 'guard_id'],
        name: 'unique_job_guard_assignment'
      },
      { fields: ['job_id'] },
      { fields: ['guard_id'] },
      { fields: ['status'] },
      { fields: ['assigned_by'] }
    ]
  });

  JobAssignment.associate = (models) => {
    JobAssignment.belongsTo(models.Job, {
      foreignKey: 'job_id',
      as: 'job'
    });

    JobAssignment.belongsTo(models.User, {
      foreignKey: 'guard_id',
      as: 'guard'
    });

    JobAssignment.belongsTo(models.User, {
      foreignKey: 'assigned_by',
      as: 'assignedBy'
    });
  };

  return JobAssignment;
};

