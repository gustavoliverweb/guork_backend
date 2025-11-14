'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('assignments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      request_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'requests', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        unique: true,
      },
      status: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: 'assigned',
      },
      assigned_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
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

    await queryInterface.addIndex('assignments', ['assigned_id']);
    await queryInterface.addIndex('assignments', ['status']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('assignments');
  }
};
