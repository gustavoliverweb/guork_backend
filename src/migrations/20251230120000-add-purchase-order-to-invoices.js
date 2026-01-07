"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create sequence for Postgres to auto-increment non-PK column
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'invoices_purchase_order_seq') THEN
          CREATE SEQUENCE invoices_purchase_order_seq START 1;
        END IF;
      END
      $$;
    `);

    await queryInterface.addColumn("invoices", "purchase_order", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: Sequelize.literal("nextval('invoices_purchase_order_seq')"),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("invoices", "purchase_order");
    await queryInterface.sequelize.query(`
      DROP SEQUENCE IF EXISTS invoices_purchase_order_seq;
    `);
  },
};
