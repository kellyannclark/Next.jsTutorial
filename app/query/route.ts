

import { db } from '@vercel/postgres';
import { NextResponse } from 'next/server';

const client = await db.connect();

async function listInvoices() {
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
    // Properly handle and narrow down the error type
    if (error instanceof Error) {
      console.error('Error handling query:', error.message);
      return NextResponse.json({ error: 'Query failed', details: error.message }, { status: 500 });
    } else {
      console.error('Unknown error occurred:', error);
      return NextResponse.json({ error: 'Query failed', details: 'An unknown error occurred' }, { status: 500 });
    }
  }
}

