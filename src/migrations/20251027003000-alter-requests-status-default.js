'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('requests', 'status', {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: 'in-progress',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('requests', 'status', {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: 'in progress',
    });
  }
};
