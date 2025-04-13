// app/types/saving.ts
export interface SavingCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  imageUrl?: string; // Thêm trường imageUrl
  createdAt: string;
  updatedAt?: string;
}

export interface Saving {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  createdAt: string;
  updatedAt?: string;
}

export const randomImages = [
  "https://img.icons8.com/color/96/savings.png",
  "https://img.icons8.com/color/96/money-bag.png",
  "https://img.icons8.com/color/96/gold-bars.png",
  "https://img.icons8.com/color/96/bitcoin.png",
  "https://img.icons8.com/color/96/stock.png",
];