'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserQuiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserQuiz.belongsTo(models.User, { foreignKey: "userId", onDelete: 'cascade' })
      UserQuiz.belongsTo(models.Quiz, { foreignKey: "quizId", onDelete: 'cascade' })
    }
  }
  UserQuiz.init({
    userId: DataTypes.INTEGER,
    quizId: DataTypes.INTEGER,
    totalCorrect: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserQuiz',
  });
  return UserQuiz;
};