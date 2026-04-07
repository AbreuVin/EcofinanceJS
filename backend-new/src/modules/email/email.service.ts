import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendConfirmationEmail = async (to: string, name: string, confirmationUrl: string) => {
    const firstName = name.split(' ')[0];

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Confirme seu cadastro – EcoFinance Group</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f7f6;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f7f6;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#166534 0%,#16a34a 100%);padding:40px 48px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">
                EcoFinance Group
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 48px 32px;">
              <h2 style="margin:0 0 16px;color:#166534;font-size:22px;font-weight:700;">
                Olá, ${firstName}! 👋
              </h2>
              <p style="margin:0 0 20px;color:#374151;font-size:16px;line-height:1.7;">
                Seu cadastro na plataforma <strong>EcoFinance Group</strong> foi realizado com sucesso.
                Para ativar seu acesso, clique no botão abaixo para confirmar seu e-mail.
              </p>
              <p style="margin:0 0 32px;color:#6b7280;font-size:14px;line-height:1.6;">
                Este link é válido por <strong>48 horas</strong>. Após esse prazo, será necessário
                solicitar um novo convite ao administrador.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${confirmationUrl}"
                       style="display:inline-block;background:linear-gradient(135deg,#166534 0%,#16a34a 100%);color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;padding:16px 40px;border-radius:8px;letter-spacing:0.3px;">
                      ✅ Confirmar Meu Cadastro
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:40px 0 28px;" />

              <!-- Link alternativo -->
              <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">
                Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
              </p>
              <p style="margin:0;font-size:12px;word-break:break-all;">
                <a href="${confirmationUrl}" style="color:#16a34a;text-decoration:none;">${confirmationUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:28px 48px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0 0 8px;color:#9ca3af;font-size:13px;">
                Se você não solicitou este cadastro, ignore este e-mail.
              </p>
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                © ${new Date().getFullYear()} EcoFinance Group ·
                <a href="https://www.grupoecofinance.com.br" style="color:#16a34a;text-decoration:none;">grupoecofinance.com.br</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    await transporter.sendMail({
        from: `"EcoFinance Group" <ecofinancegrupo@outlook.com.br>`,
        to,
        subject: '✅ Confirme seu cadastro – EcoFinance Group',
        html,
    });
};
