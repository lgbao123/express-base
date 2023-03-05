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
    }
  }
  UserQuiz.init({
    userId: DataTypes.INTERGER,
    quizId: DataTypes.INTERGER,
    totalCorrect: DataTypes.INTERGER
  }, {
    sequelize,
    modelName: 'UserQuiz',
  });
  return UserQuiz;
};