'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invoices', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2), // Usar DECIMAL para dinero es mejor que NUMBER
        allowNull: false,
      },
      assignedId: {
        type: Sequelize.UUID,
        allowNull: false,
        // Configura la clave foránea si es necesario
        references: {
          model: 'assignments', // Reemplaza 'assignments' con el nombre de tu tabla AssignmentModel
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Mejor usar función de DB para default date
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      // NOTA: La columna 'dueDate' NO se incluye aquí porque es VIRTUAL
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('invoices');
  }
};
