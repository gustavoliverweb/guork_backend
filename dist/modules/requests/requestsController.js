"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRequest = exports.updateRequest = exports.getRequestById = exports.getAllRequests = exports.createSuscriptionStripe = exports.createIntentPayStripe = exports.handleStripeWebhook = exports.createRequest = void 0;
const requestsService_1 = require("./requestsService");
const requestsZodSchema_1 = require("./schemas/requestsZodSchema");
const zod_1 = require("zod");
const stripeService_1 = require("../../shared/services/stripeService");
const assignmentsService_1 = require("../assignments/assignmentsService");
const invoiceService_1 = require("../invoices/invoiceService");
const stripe = require("stripe")(process.env.API_SECRECT_STRIPE);
const requestsService = new requestsService_1.RequestsService();
const stripeService = new stripeService_1.StripeService();
const assignmentsService = new assignmentsService_1.AssignmentsService();
const invoiceService = new invoiceService_1.InvoicesService();
const createRequest = async (req, res) => {
    try {
        console.log(req.body);
        const validatedData = requestsZodSchema_1.createRequestSchema.parse(req.body);
        const record = await requestsService.createRequest(validatedData);
        res.status(201).json(record);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ error: error.message });
    }
};
exports.createRequest = createRequest;
const handleStripeWebhook = async (req, res) => {
    // This is your Stripe CLI webhook secret for testing your endpoint locally.
    const endpointSecret = "whsec_afc16ecf0e0428baffbe1d6fc239bf90241fbf431c2ca180a536be2322251991";
    // const endpointSecret = process.env.SECRET_WEBHOOK;
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
    catch (err) {
        console.log(err);
        res.status(400).send(`Webhook Error: ${err}`);
        return;
    }
    if (event.type === "invoice.payment_succeeded") {
        const subscriptionId = event.data.object.parent.subscription_details.subscription;
        const assig = await assignmentsService.getAssignmentBySub(subscriptionId);
        await invoiceService.createInvoices({
            amount: event.data.object.amount || 0,
            assignedId: assig.id,
            urlInvoice: ''
        });
        res.status(200).send(`success`);
        return;
    }
    if (event.type === "invoice.payment_failed") {
        const subscriptionId = event.data.object.parent.subscription_details.subscription;
        console.log(subscriptionId);
        res.status(200).send(`Webhook Error pay: `);
        return;
    }
};
exports.handleStripeWebhook = handleStripeWebhook;
const createIntentPayStripe = async (req, res) => {
    try {
        console.log(req.body);
        const record = await stripeService.createCustomer(req.body);
        res.status(201).json(record);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ error: error.message });
    }
};
exports.createIntentPayStripe = createIntentPayStripe;
const createSuscriptionStripe = async (req, res) => {
    try {
        console.log(req.body);
        const record = await stripeService.createSuscription(req.body);
        await assignmentsService.updateAssignment(req.body.idAssignamed, { idSuscription: record.idSuscription });
        res.status(201).json(record);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ error: error.message });
    }
};
exports.createSuscriptionStripe = createSuscriptionStripe;
const getAllRequests = async (req, res) => {
    try {
        const pagination = {
            page: Number.parseInt(req.query.page || "1", 10),
            pageSize: Number.parseInt(req.query.pageSize || "10", 10),
            sortBy: req.query.sortBy || undefined,
            sortOrder: req.query.sortOrder,
            search: req.query.search || undefined,
            status: req.query.status || undefined,
        };
        const result = await requestsService.getAllRequests(pagination);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllRequests = getAllRequests;
const getRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await requestsService.getRequestById(id);
        res.json(record);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getRequestById = getRequestById;
const updateRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = requestsZodSchema_1.updateRequestSchema.parse(req.body);
        const record = await requestsService.updateRequest(id, validatedData);
        res.json(record);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(404).json({ error: error.message });
    }
};
exports.updateRequest = updateRequest;
const deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;
        await requestsService.deleteRequest(id);
        res.status(204).send();
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.deleteRequest = deleteRequest;
