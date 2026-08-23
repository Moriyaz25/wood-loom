import Link from "next/link";
import WoodRingDivider from "@/components/ui/WoodRingDivider";

export default async function OrderConfirmedPage({ searchParams }) {
  const { orderNumber, payment } = await searchParams;
  const isPendingPayment = payment === "pending";
  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <WoodRingDivider />
      <h1 className="mt-6 font-display text-3xl text-walnut">
        {isPendingPayment ? "Delivery details saved" : "Order received"}
      </h1>
      <p className="mt-3 font-body text-sm leading-6 text-walnut/70">
        {isPendingPayment
          ? "Your checkout is saved securely. No payment has been collected and the order remains pending until online payment is connected."
          : "Thank you. You can track the latest status from your account."}
      </p>
      {orderNumber && (
        <p className="mt-4 font-data text-sm text-sienna">
          Reference #{orderNumber}
        </p>
      )}
      <Link
        href="/products"
        className="focus-ring mt-8 inline-block rounded-full bg-sienna px-6 py-3 font-body text-sm text-ivory shadow-carve"
      >
        Continue shopping
      </Link>
      <Link
        href="/account"
        className="focus-ring ml-3 mt-8 inline-block rounded-full border border-walnut/20 px-6 py-3 font-body text-sm text-walnut"
      >
        View my account
      </Link>
    </div>
  );
}
