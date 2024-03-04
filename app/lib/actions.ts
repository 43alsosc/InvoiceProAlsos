// Importing z from the zod library
import { z } from 'zod';

// Importing the query function from the db module
import { query } from '@/db';

// Importing revalidatePath and unstable_noStore as noStore functions from next/cache module
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';

// Importing redirect function from next/navigation module
import { redirect } from 'next/navigation';

// Defining a FormSchema using zod, specifying the shape of form fields
const FormSchema = z.object({
    id: z.string(),  // Defines id as a string
    customerId: z.string({  // Defines customerId as a string with custom error message
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce  // Defines amount as a coerced number
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),  // Ensures amount is greater than 0
    status: z.enum(['pending', 'paid'], {  // Defines status as an enum with specified values
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),  // Defines date as a string
    customerName: z.string(),  // Defines customerName as a string
    email: z.string(),  // Defines email as a string
    image_url: z.string(),  // Defines image_url as a string
});

// Creating CreateInvoice schema by omitting id and date fields from FormSchema
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const CreateCustomer = FormSchema.omit({ id: true });

// Creating UpdateInvoice schema by omitting id and date fields from FormSchema
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// Defining State type, which includes optional errors and message properties
export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
        customerName?: string[];
        email?: string[];
        image_url?: string[];
    };
    message?: string | null;
};

// Asynchronous function to create an invoice, takes previous state and form data as parameters
export async function createInvoice(prevState: State, formData: FormData) {
    // Parsing and validating form data against CreateInvoice schema
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // Handling validation errors
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // Destructuring validated data
    const { customerId, amount, status } = validatedFields.data;
    const date = new Date().toISOString().split('T')[0];  // Formatting current date

    try {
        // Constructing SQL prepared statement for insertion
        const preparedStatement = `INSERT INTO  invoices
            (customer_id, amount, status, date) VALUES (?, ?, ?, ?)`;
        const values = [customerId, amount, status, date];
        // Executing SQL query with prepared statement and values
        await query(preparedStatement, values);
    } catch (error) {
        // Handling database errors
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }

    // Revalidating path and redirecting
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

// Asynchronous function to update an invoice, takes id, previous state, and form data as parameters
export async function updateInvoice(
    id: string,
    prevState: State,
    formData: FormData,
) {
    // Parsing and validating form data against UpdateInvoice schema
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // Handling validation errors
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }

    // Destructuring validated data
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;  // Converting amount to cents

    try {
        // Constructing SQL prepared statement for update
        const preparedStatement = `UPDATE invoices
            SET customer_id = ?, amount = ?, status = ?
            WHERE id = ?`;
        const values = [customerId, amountInCents, status, id];
        // Executing SQL query with prepared statement and values
        await query(preparedStatement, values);
    } catch (error) {
        // Handling database errors
        console.error('Database Error:', error);
        return { message: 'Database Error: Failed to Update Invoice.' };
    }

    // Revalidating path and redirecting
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

// Asynchronous function to fetch an invoice by id
export async function fetchInvoiceById(id: string) {
    noStore();  // Indicating no caching for this request
    try {
        // Querying database to fetch invoice data
        const data = await query(`SELECT invoices.id, invoices.customerName, invoices.amount, invoices.status FROM invoices WHERE invoices.id = ?`, [id]);
        // Mapping and formatting fetched invoice data
        const invoice = data.map((invoice: { amount: any; }) => ({
            ...invoice,
            amount: invoice.amount,
        }));

        console.log(invoice);  // Logging fetched invoice data
        return invoice[0];  // Returning first item of fetched invoices
    } catch (error) {
        // Handling database errors
        console.error('Database Error:', error);
        throw new Error('Failed to fetch invoice.');
    }
}

// Asynchronous function to fetch all customers
export async function fetchCustomers() {
    try {
        // Querying database to fetch all customer data
        const data = await query(`SELECT customers.id, customer.customerName, customer.email FROM customers ORDER BY customerName ASC`);
        const customers = data;  // Storing fetched customer data
        return customers;  // Returning fetched customers
    } catch (err) {
        // Handling database errors
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all customers.');
    }
}

export async function createCustomer(prevState: State, formData: FormData) {
    // Parsing and validating form data against CreateInvoice schema
    const validatedFields = CreateCustomer.safeParse({
        customerName: formData.get('customerName'),
        image_url: formData.get('image_url'),
        email: formData.get('email'),
    });

    // Handling validation errors
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // Destructuring validated data
    const { customerName, image_url, email
    } = validatedFields.data;

    try {
        // Constructing SQL prepared statement for insertion
        const preparedStatement = `INSERT INTO  customers
            (customerName, image_url, email) VALUES (?, ?, ?)`;
        const values = [customerName, image_url, email];
        // Executing SQL query with prepared statement and values
        await query(preparedStatement, values);
    } catch (error) {
        // Handling database errors
        return {
            message: 'Database Error: Failed to Create Customer.',
        };
    }

    // Revalidating path and redirecting
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

