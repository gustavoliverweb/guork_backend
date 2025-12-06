"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
class StripeService {
    constructor() {
        this.publicKey = process.env.API_PUBLIC_STRIPE || "";
        this.secrectKey = process.env.API_SECRECT_STRIPE || "";
    }
    async createCustomer(params) {
    }
}
exports.StripeService = StripeService;
