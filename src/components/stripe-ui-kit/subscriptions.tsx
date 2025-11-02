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

import { subscriptionSchema } from "~/lib/stripe-ui-types";
import { z } from "zod";

const subscriptionsSchema = z.array(subscriptionSchema);

export function CustomerSubscriptions() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const res = await fetch("/api/stripe-ui-kit/subscriptions");
      if (!res.ok) throw new Error("Failed to fetch charges");
      const json = await res.json();
      return subscriptionsSchema.parse(json);
    },
  });

  if (isLoading) return <div>Loading subscriptions...</div>;
  if (error) return <div>Failed to load subscriptions</div>;

  if (!data?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Subscriptions Found</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Start Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="text-center">Interval</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Next Billing</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((sub) => {
              const start = new Date(sub.created * 1000).toLocaleDateString();
              const amount =
                sub.plan?.amount != null
                  ? (sub.plan.amount / 100).toLocaleString(undefined, {
                      style: "currency",
                      currency: sub.plan.currency.toUpperCase(),
                    })
                  : "—";

              const planLabel = sub.plan?.id
                ? sub.plan.id.replace("price_", "")
                : "—";

              const interval = sub.plan?.interval ?? "—";
              const nextBilling = sub.current_period_end
                ? new Date(sub.current_period_end * 1000).toLocaleDateString()
                : "—";

              let badgeVariant: "default" | "secondary" | "destructive" =
                "secondary";
              if (sub.status === "active") badgeVariant = "default";
              else if (sub.status === "canceled") badgeVariant = "destructive";

              return (
                <TableRow key={sub.id} className="hover:bg-muted/50">
                  <TableCell>{start}</TableCell>
                  <TableCell className="text-right">{amount}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {planLabel}
                  </TableCell>
                  <TableCell className="text-center capitalize">
                    {interval}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={badgeVariant}>{sub.status}</Badge>
                  </TableCell>
                  <TableCell className="text-center">{nextBilling}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
