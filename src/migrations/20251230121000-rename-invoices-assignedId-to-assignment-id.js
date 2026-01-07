"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename column from camelCase to snake_case for consistency
    await queryInterface.renameColumn(
      "invoices",
      "assignedId",
      "assignment_id"
    );
  },

  async down(queryInterface, Sequelize) {
    // Revert column name if needed
    await queryInterface.renameColumn(
      "invoices",
      "assignment_id",
      "assignedId"
    );
  },
};
