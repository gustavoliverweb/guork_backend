'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      first_name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      email: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      role: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: 'user',
      },
      dni_img: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      dni: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      birthdate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      postal_code: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      profile_img: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes for better performance
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['dni']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
