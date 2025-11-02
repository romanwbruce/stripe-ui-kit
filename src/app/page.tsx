import { CustomerCard } from "~/components/stripe-ui-kit/customer";
import { CustomerInvoices } from "~/components/stripe-ui-kit/invoices";
import { CustomerPayments } from "~/components/stripe-ui-kit/payments";
import { CustomerSubscriptions } from "~/components/stripe-ui-kit/subscriptions";

export default function HomePage() {
  return (
    <main className="">
     
      <div className="px-4 py-12">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-4">
          <p className="text-lg font-semibold">Stripe UI Kit</p>
          <div className="grid grid-cols-2 gap-4">
            <CustomerCard />
            <CustomerInvoices />
            <CustomerPayments />
            <CustomerSubscriptions />
          </div>
        </div>
      </div>
    </main>
  );
}
