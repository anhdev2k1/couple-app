/* eslint-disable @typescript-eslint/no-explicit-any */
// app/types/saving.ts
export interface SavingCategory {
  _id?: any;
  name: string;
  color: string;
  icon: string;
  imageUrl?: string; // Thêm trường imageUrl
  createdAt: string | Date;
  updatedAt?: string;
}

export interface Saving {
  _id?: any;
  amount: number;
  description: string;
  date: string| Date;
  categoryId: string;
  createdAt: string | Date;
  updatedAt?: string;
}

export const randomImages = [
  "https://img.icons8.com/color/96/savings.png",
  "https://img.icons8.com/color/96/money-bag.png",
  "https://img.icons8.com/color/96/gold-bars.png",
  "https://img.icons8.com/color/96/bitcoin.png",
  "https://img.icons8.com/color/96/stock.png",
];