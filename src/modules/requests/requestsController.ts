import { Request, Response } from "express";
import { RequestsService } from "./requestsService";
import {
  createRequestSchema,
  updateRequestSchema,
} from "./schemas/requestsZodSchema";
import { ZodError } from "zod";
import { PaginationRequest } from "../../shared/types/paginationRequest";
import { StripeService } from "../../shared/services/stripeService";
import { AssignmentsService } from "../assignments/assignmentsService";
import { InvoicesService } from "../invoices/invoiceService";
const stripe = require("stripe")(
  process.env.API_SECRECT_STRIPE
);
const requestsService = new RequestsService();
const stripeService = new StripeService();
const assignmentsService = new AssignmentsService();
const invoiceService = new InvoicesService();
export const createRequest = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const validatedData = createRequestSchema.parse(req.body);
    const record = await requestsService.createRequest(validatedData);
    res.status(201).json(record);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
    res.status(500).json({ error: error.message });
  }
};
export const handleStripeWebhook = async (req: Request, res: Response) => {
  // This is your Stripe CLI webhook secret for testing your endpoint locally.
  const endpointSecret = "whsec_afc16ecf0e0428baffbe1d6fc239bf90241fbf431c2ca180a536be2322251991";
  // const endpointSecret = process.env.SECRET_WEBHOOK;
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
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
export const createIntentPayStripe = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const record = await stripeService.createCustomer(req.body);
    res.status(201).json(record);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
    res.status(500).json({ error: error.message });
  }
};
export const createSuscriptionStripe = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const record = await stripeService.createSuscription(req.body);
    await assignmentsService.updateAssignment(req.body.idAssignamed, { idSuscription: record.idSuscription });
    res.status(201).json(record);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
    res.status(500).json({ error: error.message });
  }
};
export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const pagination: PaginationRequest = {
      page: Number.parseInt((req.query.page as string) || "1", 10),
      pageSize: Number.parseInt((req.query.pageSize as string) || "10", 10),
      sortBy: (req.query.sortBy as string) || undefined,
      sortOrder: req.query.sortOrder as string as "asc" | "desc" | undefined,
      search: (req.query.search as string) || undefined,
      status: (req.query.status as string) || undefined,
    } as any;

    const result = await requestsService.getAllRequests(pagination);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getRequestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const record = await requestsService.getRequestById(id);
    res.json(record);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const updateRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateRequestSchema.parse(req.body);
    const record = await requestsService.updateRequest(id, validatedData);
    res.json(record);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
    res.status(404).json({ error: error.message });
  }
};

export const deleteRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await requestsService.deleteRequest(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
