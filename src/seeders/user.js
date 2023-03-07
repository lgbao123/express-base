'use strict';
const bcryptjs = require('bcryptjs')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashPassword = (password) => bcryptjs.hashSync(password, bcryptjs.genSaltSync(10))
    /**
     * Add seed commands here.
     *
     * Example:
     * 
    */
    await queryInterface.bulkInsert('User', [
      {
        username: 'Admin1',
        email: 'admin1@gmail.com',
        password: hashPassword('123456789'),
        role: "ADMIN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'Admin2',
        email: 'admin2@gmail.com',
        password: hashPassword('123456789'),
        role: "ADMIN",
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        username: 'user1',
        email: 'user1@gmail.com',
        password: hashPassword('123456789'),
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        username: 'user2',
        email: 'user2@gmail.com',
        password: hashPassword('123456789'),
        role: "USER",
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
