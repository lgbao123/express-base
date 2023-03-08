'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Question.belongsTo(models.Quiz, { foreignKey: 'quizId', onDelete: "cascade" })
      Question.hasMany(models.Answer, { foreignKey: 'questionId', onDelete: "cascade" })
    }
  }
  Question.init({
    description: DataTypes.STRING,
    image: DataTypes.TEXT('long'),
    quizId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};