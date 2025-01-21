import { db } from '@vercel/postgres';
import { NextResponse } from 'next/server';

async function listInvoices() {
  const client = await db.connect(); // Move client initialization here
  try {
    const data = await client.sql`
      SELECT invoices.amount, customers.name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.amount = 666;
    `;
    return data.rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    client.release(); // Ensure the connection is released
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
