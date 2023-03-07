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
    await queryInterface.bulkInsert('Quiz', [
      {
        name: 'Quiz1',
        description: 'Quiz1 desc',
        type: 'EASY',
        image: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Quiz2',
        description: 'Quiz2 desc',
        type: 'EASY',
        image: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        name: 'Quiz3',
        description: 'Quiz3 desc',
        type: 'MEDIUM',
        image: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        name: 'Quiz4',
        description: 'Quiz4 desc',
        type: 'HARD',
        image: "",
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
