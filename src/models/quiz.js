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
      Quiz.hasMany(models.UserQuiz, { foreignKey: 'quizId', onDelete: "cascade", hooks: true, })
      Quiz.hasMany(models.History, { foreignKey: 'quizId', onDelete: "cascade", hooks: true, })
      Quiz.hasMany(models.Question, { foreignKey: 'quizId', onDelete: "cascade", as: "qa", hooks: true, })
    }
  }
  Quiz.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.TEXT('long'),
    type: DataTypes.STRING,
    time: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'Quiz',
  });
  return Quiz;
};