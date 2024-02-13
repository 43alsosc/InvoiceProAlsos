"use client";

import React, { useEffect, useState } from "react";

interface Invoice {
  id: number;
  customerName: string;
  amount: number;
  issuedAt: string;
  dueBy: string;
  status: "pending" | "paid" | "overdue";
}

const InvoicesTable = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    fetch("/api/invoices")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setInvoices(data);
        } else {
          console.error("Fetched data is not an array:", data);

          setInvoices([]);
        }
      })
      .catch((err) => console.error("Failed to load invoices", err));
  }, []);

  return (
    <table className="min-w-full leading-normal">
      <thead>
        <tr>
          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            ID
          </th>
          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Customer Name
          </th>
          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Amount
          </th>
          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Issued At
          </th>
          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Due By
          </th>
          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((invoice) => (
          <tr key={invoice.id}>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {invoice.id}
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {invoice.customerName}
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {invoice.amount}
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {new Date(invoice.issuedAt).toLocaleDateString()}
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {new Date(invoice.dueBy).toLocaleDateString()}
            </td>
            <td
              className={`px-5 py-5 border-b border-gray-200 bg-white text-sm ${
                invoice.status === "overdue" ? "text-red-600" : "text-gray-900"
              }`}
            >
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InvoicesTable;
