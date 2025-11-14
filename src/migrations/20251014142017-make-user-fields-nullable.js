"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = "users";

    await queryInterface.changeColumn(table, "first_name", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn(table, "last_name", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn(table, "password", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn(table, "role", {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: "user",
    });
    await queryInterface.changeColumn(table, "dni", {
      type: Sequelize.TEXT,
      allowNull: true,
      unique: true,
    });
    await queryInterface.changeColumn(table, "birthdate", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn(table, "address", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    const table = "users";

    await queryInterface.changeColumn(table, "first_name", {
      type: Sequelize.TEXT,
      allowNull: false,
    });
    await queryInterface.changeColumn(table, "last_name", {
      type: Sequelize.TEXT,
      allowNull: false,
    });
    await queryInterface.changeColumn(table, "password", {
      type: Sequelize.TEXT,
      allowNull: false,
    });
    await queryInterface.changeColumn(table, "role", {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: "user",
    });
    await queryInterface.changeColumn(table, "dni", {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true,
    });
    await queryInterface.changeColumn(table, "birthdate", {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.changeColumn(table, "address", {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },
};