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
import z from "zod";
import { invoiceSchema } from "~/lib/stripe-ui-types";

const invoiceArray = z.array(invoiceSchema);

export function CustomerInvoices() {

  const { data, isLoading, error} = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
     const res = await fetch("/api/stripe-ui-kit/invoices");
      if (!res.ok) throw new Error("Failed to fetch invoices");
      const json = await res.json();

      return invoiceArray.parse(json); 
    },

  });

  if (isLoading) return <div>Loading invoices...</div>;
  if (error) return <div>Failed to load invoices</div>;

  if (!data?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Invoices Found</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Invoice #</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  {new Date(invoice.created * 1000).toLocaleDateString()}
                </TableCell>
                <TableCell>{invoice.number || "—"}</TableCell>
                <TableCell>
                  {(invoice.amount_due / 100).toLocaleString(undefined, {
                    style: "currency",
                    currency: invoice.currency.toUpperCase(),
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      invoice.status === "paid" ? "default" : "secondary"
                    }
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {invoice.hosted_invoice_url ? (
                    <a
                      href={invoice.hosted_invoice_url}
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
