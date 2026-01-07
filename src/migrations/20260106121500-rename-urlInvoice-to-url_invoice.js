"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.renameColumn("invoices", "urlInvoice", "url_invoice");
  },

  down: async (queryInterface /*, Sequelize */) => {
    return queryInterface.renameColumn("invoices", "url_invoice", "urlInvoice");
  },
};
