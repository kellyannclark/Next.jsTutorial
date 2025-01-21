import { db } from '@vercel/postgres';
import { NextResponse } from 'next/server';


async function listInvoices() {
  try {
    // Ensure a connection string is available
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('No database connection string found. Set POSTGRES_URL or DATABASE_URL.');
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Using connection string:', connectionString);
    }

    // Use the `db.sql` to run the query
    const data = await db.sql`
      SELECT invoices.amount, customers.name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.amount = 666;
    `;

    // Return query results
    return data.rows;
  } catch (error) {
    // Narrow down the type of error
    if (error instanceof Error) {
      // Log the error and throw a custom error
      console.error('Error executing query:', error.message);
      throw new Error(
        `Database query failed: ${error.message}`
      );
    } else {
      // Handle unknown error types
      console.error('An unknown error occurred:', error);
      throw new Error('An unknown error occurred while querying the database.');
    }
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
    // Narrow down the type of error
    if (error instanceof Error) {
      console.error('Error handling query:', error.message);
      return NextResponse.json(
        { error: 'Query failed', details: error.message },
        { status: 500 }
      );
    } else {
      console.error('An unknown error occurred:', error);
      return NextResponse.json(
        { error: 'Query failed', details: 'An unknown error occurred' },
        { status: 500 }
      );
    }
  }
}
