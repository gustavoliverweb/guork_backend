'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Quitar constraints UNIQUE
    await queryInterface.removeConstraint("sessions", "sessions_token_key1").catch(() => { });
    await queryInterface.removeConstraint("sessions", "sessions_token_key").catch(() => { });
    await queryInterface.removeConstraint("sessions", "sessions_token_key2").catch(() => { });

    // Quitar índices
    await queryInterface.removeIndex("sessions", "sessions_token_key1").catch(() => { });
    await queryInterface.removeIndex("sessions", "sessions_token_key").catch(() => { });
    await queryInterface.removeIndex("sessions", "sessions_token_key2").catch(() => { });
    await queryInterface.removeIndex("sessions", "sessions_token").catch(() => { });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
