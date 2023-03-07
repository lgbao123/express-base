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
    await queryInterface.bulkInsert('Answer', [
      {
        description: 'Answer 1.1',
        isCorrect: true,
        questionId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Answer 1.2',
        isCorrect: false,
        questionId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        description: 'Answer 2.1',
        isCorrect: true,
        questionId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        description: 'Answer 3.1',
        isCorrect: true,
        questionId: 3,
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
