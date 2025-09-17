const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const AttendancePing = sequelize.define('AttendancePing', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    guard_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    job_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'jobs', key: 'id' }
    },
    shift_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'shifts', key: 'id' }
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false
    },
    pinged_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'attendance_pings',
    indexes: [
      { fields: ['guard_id'] },
      { fields: ['job_id'] },
      { fields: ['shift_id'] },
      { fields: ['pinged_at'] }
    ]
  });

  AttendancePing.associate = (models) => {
    AttendancePing.belongsTo(models.User, { foreignKey: 'guard_id', as: 'guard' });
    AttendancePing.belongsTo(models.Job, { foreignKey: 'job_id', as: 'job' });
    AttendancePing.belongsTo(models.Shift, { foreignKey: 'shift_id', as: 'shift' });
  };

  return AttendancePing;
};

