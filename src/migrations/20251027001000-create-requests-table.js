'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('requests', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      employment_type: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: 'full-time',
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      requester_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: 'in progress',
      },
      profile_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'profiles', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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

    await queryInterface.addIndex('requests', ['requester_id']);
    await queryInterface.addIndex('requests', ['profile_id']);
    await queryInterface.addIndex('requests', ['status']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('requests');
  }
};
