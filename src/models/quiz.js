'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Quiz.hasMany(models.UserQuiz, { foreignKey: 'quizId', onDelete: "cascade" })
      Quiz.hasMany(models.Question, { foreignKey: 'quizId', onDelete: "cascade" })
    }
  }
  Quiz.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.TEXT('long'),
    type: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'Quiz',
  });
  return Quiz;
};