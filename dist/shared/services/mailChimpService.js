"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailChimpService = void 0;
class MailChimpService {
    constructor() {
        this.apiKey = process.env.MAILCHIMP_API_KEY || "";
        this.fromEmail = process.env.MAILCHIMP_FROM_EMAIL || "";
        this.fromName = process.env.MAILCHIMP_FROM_NAME;
        if (!this.apiKey)
            throw new Error("Missing MAILCHIMP_API_KEY");
        if (!this.fromEmail)
            throw new Error("Missing MAILCHIMP_FROM_EMAIL");
    }
    async sendPasswordResetRequest(toEmail, resetLink, subject = "Restablecer contraseña") {
        const template = "password-reset";
        const mergeVars = [
            { name: "RESET_LINK", content: resetLink },
            { name: "EMAIL", content: toEmail },
        ];
        await this.sendTemplate(template, toEmail, subject, mergeVars);
    }
    async sendPasswordChanged(toEmail, subject = "Contraseña actualizada") {
        const template = "password-changed";
        const mergeVars = [{ name: "EMAIL", content: toEmail }];
        await this.sendTemplate(template, toEmail, subject, mergeVars);
    }
    async sendTemplate(templateName, toEmail, subject, mergeVars) {
        const payload = {
            key: this.apiKey,
            template_name: templateName,
            template_content: [],
            message: {
                from_email: this.fromEmail,
                from_name: this.fromName,
                to: [{ email: toEmail, type: "to" }],
                subject,
                global_merge_vars: mergeVars,
            },
        };
        const res = await fetch("https://mandrillapp.com/api/1.0/messages/send-template.json", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const text = await safeText(res);
            throw new Error(`Mailchimp send failed (${res.status}): ${text}`);
        }
        return await res.json();
    }
}
exports.MailChimpService = MailChimpService;
async function safeText(res) {
    try {
        return await res.text();
    }
    catch {
        return "";
    }
}
