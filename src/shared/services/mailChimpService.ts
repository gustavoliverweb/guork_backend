type SendTemplatePayload = {
  key: string;
  template_name: string;
  template_content: Array<{ name: string; content: string }>;
  message: {
    from_email: string;
    from_name?: string;
    to: Array<{ email: string; name?: string; type?: string }>;
    subject?: string;
    global_merge_vars?: Array<{ name: string; content: string }>;
  };
};

export class MailChimpService {
  private apiKey: string;
  private fromEmail: string;
  private fromName?: string;

  constructor() {
    this.apiKey = process.env.MAILCHIMP_API_KEY || "";
    this.fromEmail = process.env.MAILCHIMP_FROM_EMAIL || "";
    this.fromName = process.env.MAILCHIMP_FROM_NAME;

    if (!this.apiKey) throw new Error("Missing MAILCHIMP_API_KEY");
    if (!this.fromEmail) throw new Error("Missing MAILCHIMP_FROM_EMAIL");
  }

  async sendPasswordResetRequest(
    toEmail: string,
    resetLink: string,
    subject = "Restablecer contraseña"
  ) {
    const template = "password-reset";
    const mergeVars = [
      { name: "RESET_LINK", content: resetLink },
      { name: "EMAIL", content: toEmail },
    ];
    await this.sendTemplate(template, toEmail, subject, mergeVars);
  }

  async sendPasswordChanged(
    toEmail: string,
    subject = "Contraseña actualizada"
  ) {
    const template = "password-changed";
    const mergeVars = [{ name: "EMAIL", content: toEmail }];
    await this.sendTemplate(template, toEmail, subject, mergeVars);
  }

  private async sendTemplate(
    templateName: string,
    toEmail: string,
    subject: string,
    mergeVars: Array<{ name: string; content: string }>
  ) {
    const payload: SendTemplatePayload = {
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

    const res = await fetch(
      "https://mandrillapp.com/api/1.0/messages/send-template.json",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      const text = await safeText(res);
      throw new Error(`Mailchimp send failed (${res.status}): ${text}`);
    }
    return await res.json();
  }
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}
