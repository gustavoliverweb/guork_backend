"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRequest = exports.updateRequest = exports.getRequestById = exports.getAllRequests = exports.createSuscriptionStripe = exports.createIntentPayStripe = exports.handleStripeWebhook = exports.createRequest = void 0;
const requestsService_1 = require("./requestsService");
const requestsZodSchema_1 = require("./schemas/requestsZodSchema");
const zod_1 = require("zod");
const stripeService_1 = require("../../shared/services/stripeService");
const assignmentsService_1 = require("../assignments/assignmentsService");
const invoiceService_1 = require("../invoices/invoiceService");
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const bunnyService_1 = require("../../shared/services/bunnyService");
const moment_1 = __importDefault(require("moment"));
require("moment/locale/es");
const usersService_1 = require("../users/usersService");
const chromium = require("@sparticuz/chromium");
const stripe = require("stripe")(process.env.API_SECRECT_STRIPE);
const requestsService = new requestsService_1.RequestsService();
const stripeService = new stripeService_1.StripeService();
const assignmentsService = new assignmentsService_1.AssignmentsService();
const userService = new usersService_1.UserService();
const invoiceService = new invoiceService_1.InvoicesService();
const bunny = new bunnyService_1.BunnyService();
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
    // const endpointSecret = "whsec_afc16ecf0e0428baffbe1d6fc239bf90241fbf431c2ca180a536be2322251991";
    const endpointSecret = process.env.SECRET_WEBHOOK;
    const sig = req.headers["stripe-signature"];
    console.log("stripe de pago");
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
        console.log("Pago realizado");
        const subscriptionId = event.data.object.parent.subscription_details.subscription;
        const assig = await assignmentsService.getAssignmentBySub(subscriptionId);
        const resq = await requestsService.getRequestById(assig.requestId);
        const userRecord = await userService.getUserById(resq.requesterId);
        console.log(event.data);
        const date = (0, moment_1.default)();
        const issueDate = (0, moment_1.default)();
        const dueDate = date.add(1, "month");
        const amount = event.data.object.amount_paid
            ? event.data.object.amount_paid / 100
            : 0;
        const lastInvoice = await invoiceService.getLastInvoice();
        const purchaseOrder = date.date().toString().padStart(2, "0") +
            date.month().toString().padStart(2, "0") +
            date.year().toString() +
            "-" +
            ((lastInvoice.purchaseOrder ?? 0) + 1);
        const data = {
            logo: "https://guork-cdn.b-cdn.net/assets/logo.png",
            issueDate: issueDate.locale("es").format("MMM D, YYYY"),
            dueDate: dueDate.locale("es").format("MMM D, YYYY"),
            purchaseOrder: purchaseOrder,
            balance: amount,
            quantity: 1,
            unit: amount,
            subtotal: amount,
            taxRate: 0.0,
            taxAmount: 0.0,
            total: amount,
            address: userRecord.address ?? '',
            emailCompany: userRecord.emailCompany ?? '',
            nameCompany: userRecord.nameCompany ?? '',
            nif: userRecord.nif ?? '',
            pageWeb: userRecord.pageWeb ?? '',
        };
        let urlInvoice = "";
        // // Determinar ruta del template compatible con local y Vercel
        // let templatePath = path.resolve(
        //   __dirname,
        //   "../../assets/invoice-template/invoice.ejs"
        // );
        // const fs = require("fs");
        // if (!fs.existsSync(templatePath)) {
        //   // En Vercel o si no existe en dist, buscar en src/assets relativo al root
        //   templatePath = path.join(
        //     process.cwd(),
        //     "src/assets/invoice-template/invoice.ejs"
        //   );
        // }
        const templatePath = path_1.default.join(process.cwd(), "assets", "invoice-template", "invoice.ejs");
        ejs_1.default.renderFile(templatePath, data, async (err, html) => {
            if (err) {
                console.log("Error al renderizar el template:", err);
                res.status(500).send({ error: err });
                return;
            }
            let browser = await puppeteer_core_1.default.launch({
                args: chromium.args,
                defaultViewport: { width: 1280, height: 800, deviceScaleFactor: 1 },
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
            });
            let page = await browser.newPage();
            await page.setContent(html);
            const pdfBuffer = await page.pdf({
                format: "A4",
                printBackground: true,
            });
            const fileName = `invoice-${Date.now()}.pdf`;
            const response = await bunny.upload(`invoices/${assig.id}/${fileName}`, pdfBuffer, "application/pdf");
            urlInvoice = response.publicUrl || "";
            await invoiceService.createInvoices({
                amount: event.data.object.amount_paid
                    ? event.data.object.amount_paid / 100
                    : 0,
                assignmentId: assig.id,
                purchaseOrder: (lastInvoice.purchaseOrder ?? 0) + 1,
                urlInvoice: urlInvoice,
            });
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
        await assignmentsService.updateAssignment(req.body.idAssignamed, {
            idSuscription: record.idSuscription,
        });
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
