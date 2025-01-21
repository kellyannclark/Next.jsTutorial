import { db } from '@vercel/postgres';
import { NextResponse } from 'next/server';

async function listInvoices() {
  try {
    // Ensure a connection string is available
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('No database connection string found. Set POSTGRES_URL or DATABASE_URL.');
    }

    // Use the `db.sql` to run the query
    const data = await db.sql`
      SELECT invoices.amount, customers.name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.amount = 666;
    `;
    return data.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

export async function GET() {
  try {
    console.log('Executing listInvoices query...');
    const invoices = await listInvoices();
    console.log('Query executed successfully:', invoices);

    // Return the invoice data as JSON
    return NextResponse.json({ invoices });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error handling query:', error.message);
      return NextResponse.json({ error: 'Query failed', details: error.message }, { status: 500 });
    } else {
      console.error('Unknown error occurred:', error);
      return NextResponse.json({ error: 'Query failed', details: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
