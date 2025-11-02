import { NextResponse, type NextRequest } from "next/server";
import { handlers } from "~/lib/stripe-ui-kit";
import { z } from "zod";

export async function GET(req: NextRequest, context: { params: Promise<{ route: string }> }) {
  const { route } = await context.params;
  return routeHandler("GET", req, route);
}

export async function POST(req: NextRequest, context: { params: Promise<{ route: string }> }) {
  const { route } = await context.params;
  return routeHandler("POST", req, route);
}

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

// ---- Core handler ---- //
async function routeHandler(method: "GET" | "POST", req: NextRequest, route: string) {

  const handlerSet = handlers[route as keyof typeof handlers];

  //@ts-ignore
  if (!handlerSet || !handlerSet[method]) {
    return NextResponse.json({ error: "Route or method not supported" }, { status: 404 });
  }

  const customerId = await auth(req);
  if (!customerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //@ts-ignore
  const { schema, fn } = handlerSet[method];

  try {
    const raw =
      method === "POST"
        ? await req.json()
        : Object.fromEntries(req.nextUrl.searchParams);

    const isUndefinedSchema =
      schema instanceof z.ZodUndefined ||
      (schema as any)._def?.typeName === "ZodUndefined";

    const validated = isUndefinedSchema ? undefined : schema.parse(raw);

    const result = await fn(validated, customerId);
    return NextResponse.json(result);

  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid body", details: err.errors }, { status: 400 });
    }

    console.error("Stripe route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

}
