# Stripe UI Kit

Easily show your customers stripe infomation in your own app.

Works with any auth provider! See Considerations

# Requirements

Tanstack Query, Next.js, zod

# Considerations

In order to have it work properly, you will need to modify the auth function to work with your provider. 

```
//Must return the stripe customerId of the logged in user.
async function auth(req: NextRequest): Promise<string | null> {
  // Example: replace this with Clerk, JWT, or cookie logic later

  /*
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
*/

  // Dummy verification logic
  if (true) {
    return "cus_S9KoQJg6Cy8ydG"; // Mocked customer ID
  }

  return null;
}
```

For security reasons, you should determine which stripe customer ID to use based off the current logged in user (instead of passing it from the frontend).

This function should return a string if have the customer ID, or null if the user is not logged in. 

It is good practice to store the customer ID in your user table, or as metadata if you're using Clerk. 

For this example, i'm just returning a test customer ID.