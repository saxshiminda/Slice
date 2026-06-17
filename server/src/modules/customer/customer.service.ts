import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/app-error.js';
import { env } from '../../config/env.js';
import type {
  RegisterCustomerInput,
  LoginCustomerInput,
  UpdateCustomerInput,
} from './customer.schema.js';

const SAFE_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  createdAt: true,
  updatedAt: true,
} as const;

function signToken(customerId: string, email: string): string {
  return jwt.sign({ customerId, email }, env.customerJwtSecret, { expiresIn: '30d' });
}

export async function registerCustomer(input: RegisterCustomerInput) {
  const existing = await prisma.customer.findUnique({ where: { email: input.email } });
  if (existing) throw new AppError(409, 'An account with this email already exists');

  const passwordHash = await bcrypt.hash(input.password, 12);
  const customer = await prisma.customer.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      passwordHash,
    },
    select: SAFE_SELECT,
  });

  const token = signToken(customer.id, customer.email);
  return { customer, token };
}

export async function loginCustomer(input: LoginCustomerInput) {
  const customer = await prisma.customer.findUnique({ where: { email: input.email } });
  if (!customer) throw new AppError(401, 'Invalid email or password');

  const valid = await bcrypt.compare(input.password, customer.passwordHash);
  if (!valid) throw new AppError(401, 'Invalid email or password');

  const token = signToken(customer.id, customer.email);
  const { passwordHash: _pw, ...safe } = customer;
  return { customer: safe, token };
}

export async function getCustomerById(id: string) {
  const customer = await prisma.customer.findUnique({
    where: { id },
    select: SAFE_SELECT,
  });
  if (!customer) throw new AppError(404, 'Customer not found');
  return customer;
}

export async function updateCustomer(id: string, input: UpdateCustomerInput) {
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) throw new AppError(404, 'Customer not found');
  return prisma.customer.update({
    where: { id },
    data: input,
    select: SAFE_SELECT,
  });
}
