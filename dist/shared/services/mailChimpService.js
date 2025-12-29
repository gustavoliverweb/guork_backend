"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailChimpService = void 0;
const mailchimp = require("@mailchimp/mailchimp_transactional")(process.env.API_SECRECT_MANDRILL);
class MailChimpService {
    constructor() {
        this.apiKey = process.env.API_SECRECT_MANDRILL || "";
        this.fromEmail = "alejandro@guork.es";
        this.fromName = "Guork App";
        if (!this.apiKey)
            throw new Error("Missing MAILCHIMP_API_KEY");
        if (!this.fromEmail)
            throw new Error("Missing MAILCHIMP_FROM_EMAIL");
    }
    async sendPasswordResetRequest(toEmail, resetLink, subject = "Restablecer contraseña") {
        const template = "restablece-tu-contrase-a";
        const mergeVars = [
            {
                name: "LINK",
                content: resetLink
            },
        ];
        await this.sendTemplate(template, toEmail, subject, mergeVars);
    }
    async sendRegisterSuccess(toEmail, resetLink, subject = "Registro éxitoso") {
        const template = "registro-con-xito";
        var mergeVars = [];
        await this.sendTemplate(template, toEmail, subject, mergeVars);
    }
    async sendAssignementSuccess(toEmail, resetLink, subject = "Nueva contratación") {
        const template = "tu-nueva-contrataci-n";
        var mergeVars = [];
        await this.sendTemplate(template, toEmail, subject, mergeVars);
    }
    async sendTemplate(templateName, toEmail, subject, mergeVars) {
        const payload = {
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
        const res = await mailchimp.messages.sendTemplate(payload);
        console.log(res);
        return await {
            res: res
        };
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
