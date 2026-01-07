"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Change profiles.amount from DECIMAL(10,2) to FLOAT
    await queryInterface.changeColumn("profiles", "amount", {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    });

    // Change profiles.part_time_amount from DECIMAL(10,2) to FLOAT
    await queryInterface.changeColumn("profiles", "part_time_amount", {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert profiles.amount back to DECIMAL(10,2)
    await queryInterface.changeColumn("profiles", "amount", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    });

    // Revert profiles.part_time_amount back to DECIMAL(10,2)
    await queryInterface.changeColumn("profiles", "part_time_amount", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    });
  },
};
