/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Plan {
  _id?: any;
  title: string;
  description: string;
  date: string;
  location: string;
  budget: number;
  completed: boolean;
  createdAt: string | Date;
}
