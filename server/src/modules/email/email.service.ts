import { Resend } from 'resend';
import { env } from '../../config/env.js';

let resend: Resend | null = null;

function getClient(): Resend | null {
  if (!env.resendApiKey) return null;
  if (!resend) resend = new Resend(env.resendApiKey);
  return resend;
}

async function send(params: { to: string; subject: string; html: string }): Promise<void> {
  const client = getClient();
  if (!client) {
    // In development without a key, log to console instead of throwing.
    console.log(
      `[Email stub] To: ${params.to} | Subject: ${params.subject}\n${params.html.replace(/<[^>]+>/g, '')}`
    );
    return;
  }
  await client.emails.send({ from: env.emailFrom, ...params });
}

export async function sendOrderConfirmationToCustomer(order: {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: { cakeName: string; quantity: number; unitPrice: number }[];
}): Promise<void> {
  const itemsHtml = order.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #e5e0d8;">${i.cakeName}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e0d8;text-align:center;">×${i.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e0d8;text-align:right;">₾${(i.unitPrice * i.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join('');

  await send({
    to: order.customerEmail,
    subject: `Your Slice order #${order.id.slice(-6).toUpperCase()}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1C1209;">
        <h2 style="color:#D4967A;">Thank you, ${order.customerName}!</h2>
        <p>Your order has been received and payment confirmed. We will prepare it for you.</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0;">
          ${itemsHtml}
          <tr>
            <td colspan="2" style="padding:12px 0;font-weight:600;">Total</td>
            <td style="padding:12px 0;text-align:right;font-weight:600;">₾${order.total.toFixed(2)}</td>
          </tr>
        </table>
        <p style="color:#888;">Order reference: <strong>#${order.id.slice(-6).toUpperCase()}</strong></p>
      </div>
    `,
  });
}

export async function sendNewOrderAlertToBakery(order: {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  total: number;
  fulfillmentType: string;
  items: { cakeName: string; quantity: number }[];
}): Promise<void> {
  if (!env.emailBakery) return;

  const itemsList = order.items.map((i) => `${i.cakeName} ×${i.quantity}`).join(', ');

  await send({
    to: env.emailBakery,
    subject: `New order #${order.id.slice(-6).toUpperCase()} — ₾${order.total.toFixed(2)}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1C1209;">
        <h2 style="color:#D4967A;">New paid order</h2>
        <p><strong>Customer:</strong> ${order.customerName} (${order.customerEmail})</p>
        ${order.customerPhone ? `<p><strong>Phone:</strong> ${order.customerPhone}</p>` : ''}
        <p><strong>Fulfillment:</strong> ${order.fulfillmentType}</p>
        <p><strong>Items:</strong> ${itemsList}</p>
        <p><strong>Total:</strong> ₾${order.total.toFixed(2)}</p>
        <p>Log in to the admin panel to view and update the order status.</p>
      </div>
    `,
  });
}

export async function sendInquiryNotificationToBakery(inquiry: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  if (!env.emailBakery) return;

  await send({
    to: env.emailBakery,
    subject: `New enquiry from ${inquiry.name}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1C1209;">
        <h2 style="color:#D4967A;">New contact enquiry</h2>
        <p><strong>From:</strong> ${inquiry.name} &lt;${inquiry.email}&gt;</p>
        <p style="white-space:pre-wrap;">${inquiry.message}</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${env.clientUrl}/reset-password?token=${token}`;
  await send({
    to: email,
    subject: 'Reset your Slice password',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1C1209;">
        <h2 style="color:#D4967A;">Password reset</h2>
        <p>Click the link below to reset your password. The link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#D4967A;color:white;text-decoration:none;">Reset password</a>
        <p style="color:#888;font-size:12px;">If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });
}
