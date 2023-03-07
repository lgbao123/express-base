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
    await queryInterface.bulkInsert('Question', [
      {
        description: 'Question 1',
        image: "",
        quizId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Question 2',
        image: "",
        quizId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        description: 'Question 3',
        image: "",
        quizId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        description: 'Question 4',
        image: "",
        quizId: 3,
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
