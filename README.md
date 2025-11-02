# Stripe UI Kit

Easily display your customers' Stripe information in your own app. Works with any authentication provider.

## Features

- View customer information, invoices, payments, and subscriptions
- Built with Next.js and TanStack Query
- Styled with ShadCN UI components
- Fully customizable and extensible
- Uses native Stripe API calls

## Requirements

- Next.js
- TanStack Query
- Zod
- React Hook Form
- Stripe

## Installation

1. Copy the following files to your project:
   - `src/lib/stripe-ui-kit.ts`
   - `src/lib/stripe-ui-types.ts`
   - `src/components/stripe-ui-kit/*` (all files in this directory)

2. Copy the API endpoint to your project:
   - `src/app/api/stripe-ui-kit/[route]/route.ts`

3. Ensure all required dependencies are installed.

4. Modify the `auth` function in the API route to work with your authentication provider (see [Authentication](#authentication) below).

## Styling

This project uses ShadCN UI components, which you can customize to match your app's design system.

## Authentication

**Important**: You must configure authentication before using this kit in production.

The API route includes an `auth` function that determines which Stripe customer ID to retrieve based on the currently logged-in user. For security reasons, **never pass the customer ID from the frontend**. Always determine it server-side based on the authenticated user.

The `auth` function must:

- Return a `string` (the Stripe customer ID) if the user is authenticated
- Return `null` if the user is not authenticated

### Example Implementation

```typescript
// Must return the Stripe customerId of the logged-in user
async function auth(req: NextRequest): Promise<string | null> {
  // Example: replace this with Clerk, JWT, or cookie logic

  /*
  const authHeader = req.headers.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  
  const token = authHeader.split(" ")[1];
  // Verify token and get user ID
  // Look up customer ID from your database
  */

  // For development/example purposes only:
  if (true) {
    return "cus_S9KoQJg6Cy8ydG"; // Mocked customer ID
  }

  return null;
}
```

### Best Practices

- Store the Stripe customer ID in your user database table
- If using Clerk, store it as user metadata
- Always verify authentication before returning a customer ID
- Never trust customer IDs sent from the client

In this example project, the auth function returns a test customer ID for demonstration purposes only.
