const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const AttendanceAlarm = sequelize.define('AttendanceAlarm', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
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
    interval_minutes: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' }
    }
  }, {
    tableName: 'attendance_alarms',
    indexes: [
      { fields: ['job_id'] },
      { fields: ['shift_id'] },
      { fields: ['active'] }
    ]
  });

  AttendanceAlarm.associate = (models) => {
    AttendanceAlarm.belongsTo(models.Job, { foreignKey: 'job_id', as: 'job' });
    AttendanceAlarm.belongsTo(models.Shift, { foreignKey: 'shift_id', as: 'shift' });
    AttendanceAlarm.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });
    AttendanceAlarm.belongsTo(models.User, { foreignKey: 'updated_by', as: 'updater' });
  };

  return AttendanceAlarm;
};

