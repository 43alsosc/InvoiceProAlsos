import InvoicesTable from "@/app/ui/invoices/invoice-table";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <InvoicesTable />
    </main>
  );
}
