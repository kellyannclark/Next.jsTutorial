import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';

async function seedUsers() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('No database connection string found. Set POSTGRES_URL or DATABASE_URL.');
  }

  try {
    console.log('Creating users table...');
    await db.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;
    console.log('Users table created.');

    console.log('Inserting users...');
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return db.sql`
          INSERT INTO users (id, name, email, password)
          VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
          ON CONFLICT (id) DO NOTHING;
        `;
      })
    );
    console.log('Users inserted:', insertedUsers.length);
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedCustomers() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('No database connection string found. Set POSTGRES_URL or DATABASE_URL.');
  }

  try {
    console.log('Creating customers table...');
    await db.sql`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        image_url TEXT NOT NULL
      );
    `;
    console.log('Customers table created.');

    console.log('Inserting customers...');
    const insertedCustomers = await Promise.all(
      customers.map((customer) =>
        db.sql`
          INSERT INTO customers (id, name, email, image_url)
          VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
          ON CONFLICT (id) DO NOTHING;
        `
      )
    );
    console.log('Customers inserted:', insertedCustomers.length);
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

// Export the GET method
export async function GET() {
  try {
    console.log('Seeding users...');
    await seedUsers();
    console.log('Users seeded successfully.');

    console.log('Seeding customers...');
    await seedCustomers();
    console.log('Customers seeded successfully.');

    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    // Handle errors properly
    if (error instanceof Error) {
      console.error('Seeding failed:', error.message);
      return NextResponse.json({ error: 'Seeding failed', details: error.message }, { status: 500 });
    } else {
      console.error('Unknown error occurred:', error);
      return NextResponse.json({ error: 'Seeding failed', details: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
