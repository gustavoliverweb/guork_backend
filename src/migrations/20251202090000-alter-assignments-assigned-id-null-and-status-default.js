'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Make assigned_id nullable
    await queryInterface.changeColumn('assignments', 'assigned_id', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    // Set status default to 'in-progress'
    await queryInterface.changeColumn('assignments', 'status', {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: 'in-progress',
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert assigned_id to NOT NULL (previous behavior)
    await queryInterface.changeColumn('assignments', 'assigned_id', {
      type: Sequelize.UUID,
      allowNull: false,
    });

    // Revert status default back to 'assigned' (previous behavior)
    await queryInterface.changeColumn('assignments', 'status', {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: 'assigned',
    });
  },
};
