'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      History.belongsTo(models.User, { foreignKey: "userId", onDelete: 'cascade' })
      History.belongsTo(models.Quiz, { foreignKey: "quizId", onDelete: 'cascade' })
    }
  }
  History.init({
    userId: DataTypes.INTEGER,
    quizId: DataTypes.INTEGER,
    totalCorrect: DataTypes.INTEGER,
    totalQuestion: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};