"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import { chargeSchema } from "~/lib/stripe-ui-types";
import { z } from "zod";

const chargeArraySchema = z.array(chargeSchema);

export function CustomerPayments() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["charges"],
    queryFn: async () => {
      const res = await fetch("/api/stripe-ui-kit/charges");
      if (!res.ok) throw new Error("Failed to fetch charges");
      const json = await res.json();
      return chargeArraySchema.parse(json); // runtime validation
    },
  });

  if (isLoading) return <div>Loading payments...</div>;
  if (error) return <div>Failed to load payments</div>;

  if (!data?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Payments Found</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Payments</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Card</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((charge) => (
              <TableRow key={charge.id}>
                <TableCell>
                  {new Date(charge.created * 1000).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {(charge.amount / 100).toLocaleString(undefined, {
                    style: "currency",
                    currency: charge.currency.toUpperCase(),
                  })}
                </TableCell>
                <TableCell>
                  {charge.payment_method_details?.card?.brand
                    ? `${charge.payment_method_details.card.brand.toUpperCase()} •••• ${charge.payment_method_details.card.last4}`
                    : "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={charge.status === "succeeded" ? "default" : "secondary"}
                  >
                    {charge.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {charge.receipt_url ? (
                    <a
                      href={charge.receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      View
                    </a>
                  ) : (
                    "—"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
