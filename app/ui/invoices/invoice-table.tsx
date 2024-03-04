'use client';

import React, { useEffect, useState } from "react";
import { UpdateInvoice } from "./buttons";
import InvoiceStatus from "./status";
import Image from "next/image";
import { formatCurrency, formatDateToLocal } from "@/app/lib/utils";

interface Invoice {
  id: string;
  image_url: string; // Endre når den tid kommer
  customerName: string;
  email: string;
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
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle"></div>
       {/* Container for the invoice table, with different layouts for mobile and desktop views */}
       <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
       {/**/}
       {/**/}
       {/* Mobile view: list of invoices */}
       {/**/}
       {/**/}
       <div className="md:hidden">
         {invoices?.map((invoice) => (
           <div
             key={invoice.id}
             className="mb-2 w-full rounded-md bg-white p-4"
           >
             {/* Invoice card for mobile view */}
             <div className="flex items-center justify-between border-b pb-4">
               {/* Customer information and email */}
               <div>
                 <div className="mb-2 flex items-center">
                   {/* Customer avatar */}
                   <Image
                     alt="bilde"
                     src={invoice.image_url}
                     className="mr-2 rounded-full"
                     width={28}
                     height={28}
                   />
                   {/* Customer name */}
                   <p>{invoice.customerName}</p>
                 </div>
                 {/* Customer email */}
                 <p className="text-sm text-gray-500">{invoice.email}</p>
               </div>
               {/* Status indicator component */}
               <InvoiceStatus status={invoice.status} />
             </div>
             <div className="flex w-full items-center justify-between pt-4">
               {/* Invoice amount and date */}
               <div>
                 <p className="text-xl font-medium">
                   {formatCurrency(invoice.amount)}
                 </p>
                 <p>
                  {formatDateToLocal(invoice.dueBy)}
                 </p>
               </div>
               {/* Action buttons for update and delete operations */}
               <div className="flex justify-end gap-2">
                 <UpdateInvoice id={invoice.id} />
                 {/* <DeleteInvoice id={invoice.id} /> */}
               </div>
             </div>
           </div>
         ))}
       </div>
       {/**/}
       {/**/}
       {/* Desktop view: table layout */}
       {/**/}
       {/**/}
       <table className="hidden min-w-full text-gray-900 md:table">
         <thead className="rounded-lg text-left text-sm font-normal">
           {/* Table headers */}
           <tr>
             <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
               Customer
             </th>
             <th scope="col" className="px-3 py-5 font-medium">
               Email
             </th>
             <th scope="col" className="px-3 py-5 font-medium">
               Amount
             </th>
             <th scope="col" className="px-3 py-5 font-medium">
               Date
             </th>
             <th scope="col" className="px-3 py-5 font-medium">
               Status
             </th>
             <th scope="col" className="relative py-3 pl-6 pr-3">
               <span className="sr-only">Edit</span>
             </th>
           </tr>
         </thead>
         <tbody className="bg-white">
          {/**/}
           {/**/}
           {/* Table rows */}
           {/**/}
           {/**/}
        {invoices.map((invoice) => (
          <>
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
            <td className={`px-5 py-5 border-b border-gray-200 bg-white text-sm`}>
            <InvoiceStatus status={invoice.status} />

          </td>
          <td className="whitespace-nowrap py-3 pl-6 pr-3">
              <div className="flex justify-end gap-3">
                <UpdateInvoice id={invoice.id}></UpdateInvoice>
              </div>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              {/* <button
                type="button"
                className="text-blue-600 hover:text-blue-900"
                onClick={() => deleteInvoice(invoice.id)}
              >
                Delete
              </button> */}
            </td>
            </tr>
          </>
        ))}
      </tbody>
    </table>
    </div>
    </div>
  );
};

export default InvoicesTable;