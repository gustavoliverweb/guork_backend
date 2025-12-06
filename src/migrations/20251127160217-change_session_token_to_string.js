'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("sessions", "token", {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir a TEXT si es necesario
    await queryInterface.changeColumn("sessions", "token", {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true,
    });

    await queryInterface.changeColumn("sessions", "tokenPush", {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true,
      defaultValue: "",
    });
  }
};
