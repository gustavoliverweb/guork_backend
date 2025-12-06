export class StripeService {
    private publicKey: String;
    private secrectKey: String;
    constructor() {
        this.publicKey = process.env.API_PUBLIC_STRIPE || "";
        this.secrectKey = process.env.API_SECRECT_STRIPE || "";
    }
    async createCustomer(params: any) {

    }

}