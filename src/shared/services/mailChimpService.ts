const mailchimp = require("@mailchimp/mailchimp_transactional")(
  process.env.API_SECRECT_MANDRILL
);
type SendTemplatePayload = {
  template_name: string;
  template_content: Array<{ name: string; content: string }>;
  message: {
    from_email: string;
    from_name?: string;
    to: Array<{ email: string; name?: string; type?: string }>;
    subject?: string;
    global_merge_vars?: Array<{ name: string, content: string }>;
  };
};

export class MailChimpService {
  private apiKey: string;
  private fromEmail: string;
  private fromName?: string;

  constructor() {
    this.apiKey = process.env.API_SECRECT_MANDRILL || "";
    this.fromEmail = "alejandro@guork.es";
    this.fromName = "Guork App";

    if (!this.apiKey) throw new Error("Missing MAILCHIMP_API_KEY");
    if (!this.fromEmail) throw new Error("Missing MAILCHIMP_FROM_EMAIL");
  }

  async sendPasswordResetRequest(
    toEmail: string,
    resetLink: string,
    subject = "Restablecer contraseña",
  ) {
    const template = "restablece-tu-contrase-a";
    const mergeVars = [

      {
        name: "LINK",
        content: resetLink

      },


    ];
    await this.sendTemplate(template, toEmail, subject, mergeVars);
  }
  async sendRegisterSuccess(
    toEmail: string,
    resetLink: string,
    subject = "Registro éxitoso",
  ) {
    const template = "registro-con-xito";
    var mergeVars: { name: string, content: string }[] = [];
    await this.sendTemplate(template, toEmail, subject, mergeVars);
  }

  async sendAssignementSuccess(
    toEmail: string,
    resetLink: string,
    subject = "Nueva contratación",
  ) {
    const template = "tu-nueva-contrataci-n";
    var mergeVars: { name: string, content: string }[] = [];
    await this.sendTemplate(template, toEmail, subject, mergeVars);
  }
  private async sendTemplate(
    templateName: string,
    toEmail: string,
    subject: string,
    mergeVars: Array<{ name: string, content: string }>
  ) {
    const payload: SendTemplatePayload = {

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

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}
