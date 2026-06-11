import { prisma } from '../../lib/prisma.js';
import type { CreateInquiryInput } from './inquiry.schema.js';

export async function createInquiry(input: CreateInquiryInput) {
  const inquiry = await prisma.inquiry.create({ data: input });

  // TODO: plug in Resend mailer here — send notification email to bakery owner
  // await sendInquiryNotification(inquiry);

  return inquiry;
}
