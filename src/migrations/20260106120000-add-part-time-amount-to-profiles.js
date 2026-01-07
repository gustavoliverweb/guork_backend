"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("profiles", "part_time_amount", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    });
  },

  down: async (queryInterface /*, Sequelize */) => {
    return queryInterface.removeColumn("profiles", "part_time_amount");
  },
};
