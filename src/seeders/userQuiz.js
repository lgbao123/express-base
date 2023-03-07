'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    /**
     * Add seed commands here.
     *
     * Example:
     * 
    */
    await queryInterface.bulkInsert('UserQuiz', [
      {
        quizId: 1,
        userId: 1,
        totalCorrect: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        quizId: 1,
        userId: 2,
        totalCorrect: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        quizId: 2,
        userId: 3,
        totalCorrect: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        quizId: 1,
        userId: 4,
        totalCorrect: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
