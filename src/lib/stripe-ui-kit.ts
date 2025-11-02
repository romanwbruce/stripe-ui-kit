"only server"

import { z } from "zod";

import Stripe from "stripe";
import { customerSchema, blankSchema } from "./stripe-ui-types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-10-29.clover",
});

async function getCustomerInfo(body: z.infer<typeof blankSchema>, customerId: string) {

    try {
        const customer = await stripe.customers.retrieve(customerId);

        if (!customer || customer.deleted) {
            throw new Error(`Customer ${customerId} not found or deleted`);
        }

        return customer;
    } catch (error) {
        console.error("Error retrieving customer:", error);
        throw new Error("Failed to retrieve customer information");
    }
}

async function getCustomerInvoices(body: z.infer<typeof blankSchema>, customerId: string) {

    try {
        const invoices = await stripe.invoices.list({
            customer: customerId
        })

        return invoices.data;
    } catch (error) {
        console.error("Error retrieving customer:", error);
        throw new Error("Failed to retrieve customer information");
    }
}

async function getCustomerSubscriptions(body: z.infer<typeof blankSchema>, customerId: string) {

    try {
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId
        })

        console.log(subscriptions.data)

        return subscriptions.data;
    } catch (error) {
        console.error("Error retrieving customer:", error);
        throw new Error("Failed to retrieve customer information");
    }
}


async function getCustomerPayments(body: z.infer<typeof blankSchema>, customerId: string) {

    try {
        const charges = await stripe.charges.list({
            customer: customerId
        })

        return charges.data;
    } catch (error) {
        console.error("Error retrieving customer:", error);
        throw new Error("Failed to retrieve customer information");
    }
}

export async function updateCustomer(
    body: z.infer<typeof customerSchema>,
    customerId: string
) {
    try {
        const clean = (obj: Record<string, any>) =>
            Object.fromEntries(
                Object.entries(obj).filter(
                    ([, value]) => value !== null && value !== undefined && value !== ""
                )
            );

        const updated = await stripe.customers.update(customerId, {
            name: body.name || undefined,
            email: body.email || undefined,
            address: clean(body.address),
        });

        return updated;
    } catch (error) {
        console.error("Stripe update failed:", error);
        throw new Error("Failed to update Stripe customer");
    }
}

export const handlers = {
    "customer": {
        GET: {
            schema: blankSchema,
            fn: getCustomerInfo
        },
    },
    "invoices": {
        GET: {
            schema: blankSchema,
            fn: getCustomerInvoices
        },
    },
    "charges": {
        GET: {
            schema: blankSchema,
            fn: getCustomerPayments
        },
    },
    "subscriptions": {
        GET: {
            schema: blankSchema,
            fn: getCustomerSubscriptions
        },
    },
    "customer-update": {
        POST: {
            schema: customerSchema,
            fn: updateCustomer
        },
    },
};


