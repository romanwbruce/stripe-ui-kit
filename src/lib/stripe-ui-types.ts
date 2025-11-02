import { z } from "zod";

export const blankSchema = z.undefined()

export const customerSchema = z.object({
    address: z.object({
        city: z.string().nullable(),
        country: z.string().nullable(),
        line1: z.string().nullable(),
        line2: z.string().nullable(),
        postal_code: z.string().nullable(),
        state: z.string().nullable(),
    }),
    name: z.string().nullable(),
    email: z.string().email().nullable(),
    currency: z.string().toLowerCase(),
});

export const chargeSchema = z.object({
    id: z.string(),
    amount: z.number(),
    currency: z.string(),
    status: z.string(),
    created: z.number(), // Unix timestamp
    description: z.string().nullable(),
    receipt_url: z.string().nullable(),
    payment_method_details: z
        .object({
            type: z.string().nullable(),
            card: z
                .object({
                    brand: z.string().nullable(),
                    last4: z.string().nullable(),
                })
                .nullable(),
        })
        .nullable(),
});

export const invoiceSchema = z.object({
    id: z.string(),
    number: z.string().nullable(),
    status: z.string().nullable(),
    customer: z.string().nullable(),
    hosted_invoice_url: z.string().nullable(),
    invoice_pdf: z.string().nullable(),
    amount_due: z.number(),
    amount_paid: z.number(),
    currency: z.string(),
    created: z.number()
}).passthrough();

export const subscriptionSchema = z.object({
    id: z.string(),
    status: z.string(), // "active", "past_due", "canceled", etc.
    customer: z.string(),
    currency: z.string(),
    current_period_start: z.number().optional().nullable(),
    current_period_end: z.number().optional().nullable(),
    cancel_at_period_end: z.boolean(),
    canceled_at: z.number().nullable(),
    created: z.number(),
    latest_invoice: z.string().nullable(),
    default_payment_method: z.string().nullable(),
    plan: z
      .object({
        id: z.string(),
        amount: z.number(),
        currency: z.string(),
        interval: z.string(),
        product: z.string(),
      })
      .nullable(),
    quantity: z.number().nullable(),
  }).passthrough();