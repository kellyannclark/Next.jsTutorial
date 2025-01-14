import { Inter } from 'next/font/google';
// fonts.ts
import { Lusitana } from 'next/font/google';

// Configure Lusitana font
export const lusitana = Lusitana({
  weight: '400', // Specify the font weight
  subsets: ['latin'], // Specify the subset
});

 
export const inter = Inter({ subsets: ['latin'] });