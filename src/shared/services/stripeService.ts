const stripe = require("stripe")(
    process.env.API_SECRECT_STRIPE
);
export class StripeService {
    private publicKey: String;
    private secrectKey: String;
    constructor() {
        this.publicKey = process.env.API_PUBLIC_STRIPE || "";
        this.secrectKey = process.env.API_SECRECT_STRIPE || "";
    }
    async createCustomer(params: { email: string, nameClient: string }): Promise<{ clientSecret: string, customerId: string }> {
        const customer = await stripe.customers.create({
            email: params.email,
            name: params.nameClient,
        });
        const setupIntent = await stripe.setupIntents.create({
            customer: customer.id,
            payment_method_types: ["card"],
        });
        return { clientSecret: setupIntent.client_secret, customerId: customer.id };
    }
    async createSuscription(params: { amount: number, profileName: string, customerId: string, idPayment: string, idAssignamed: string }): Promise<{ idSuscription: string }> {
        const price = await stripe.prices.create({
            unit_amount: params.amount, // Monto en la moneda mínima (ej.: 1000 para $10.00)
            currency: "eur",
            recurring: {
                interval: "month", // 'day', 'week', 'month', o 'year'
            },
            product_data: {
                name: params.profileName, // Nombre dinámico o general
            },
        });
        const subscription = await stripe.subscriptions.create({
            customer: params.customerId,
            items: [{ price: price.id }],
            expand: ["latest_invoice.payment_intent"],
            default_payment_method: params.idPayment,
        });
        if (subscription.latest_invoice.payment_intent.status === "succeeded") {
            console.log(subscription.id);
            return {
                idSuscription: subscription.id
            };
        } else {
            throw new Error("Request not found");
        }
    }

}