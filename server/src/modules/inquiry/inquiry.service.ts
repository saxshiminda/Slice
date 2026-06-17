import { prisma } from '../../lib/prisma.js';
import { sendInquiryNotificationToBakery } from '../email/email.service.js';
import type { CreateInquiryInput } from './inquiry.schema.js';

export async function createInquiry(input: CreateInquiryInput) {
  const inquiry = await prisma.inquiry.create({ data: input });

  void sendInquiryNotificationToBakery({
    name: inquiry.name,
    email: inquiry.email,
    message: inquiry.message,
  }).catch(console.error);

  return inquiry;
}

export async function listInquiries() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return { inquiries, total: inquiries.length };
}
