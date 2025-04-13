/* eslint-disable @typescript-eslint/no-unused-vars */
// app/lib/data.ts
import { v4 as uuidv4 } from "uuid";
import { Couple } from "../types/couple";
import { Plan } from "../types/plan";
import { randomImages, Saving, SavingCategory } from "../types/saving";

let coupleData: Couple = {
  startDate: new Date().toISOString(),
};

let plans: Plan[] = [];


let savingCategories: SavingCategory[] = [
  {
    id: "1",
    name: "Tiền mặt",
    color: "#4ade80",
    icon: "money-bill",
    imageUrl: "https://img.icons8.com/color/96/money.png",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Đầu tư",
    color: "#3b82f6",
    icon: "chart-line",
    imageUrl: "https://img.icons8.com/color/96/investment-portfolio.png",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Vàng",
    color: "#f59e0b",
    icon: "gem",
    imageUrl: "https://img.icons8.com/color/96/gold-bars.png",
    createdAt: new Date().toISOString(),
  },
];

let savings: Saving[] = [];

/*
---
Couple functions
---
*/
export const getCoupleData = (): Couple => coupleData;
export const updateCoupleData = (newData: Partial<Couple>): Couple => {
  coupleData = { ...coupleData, ...newData };
  return coupleData;
};

/*
---
Plans functions
---
*/
export const getPlans = (): Plan[] => plans;

export const addPlan = (plan: Omit<Plan, "id" | "createdAt">): Plan => {
  const newPlan: Plan = {
    id: uuidv4(),
    ...plan,
    createdAt: new Date().toISOString(),
  };
  plans.push(newPlan);
  return newPlan;
};

export const updatePlan = (
  id: string,
  updatedPlan: Partial<Plan>
): Plan | null => {
  const index = plans.findIndex((plan) => plan.id === id);
  if (index !== -1) {
    plans[index] = { ...plans[index], ...updatedPlan };
    return plans[index];
  }
  return null;
};

export const deletePlan = (id: string): void => {
  plans = plans.filter((plan) => plan.id !== id);
};

export const getUpcomingPlans = (): Plan[] => {
  return plans
    .filter((plan) => !plan.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/*
---
Saving functions
---
*/
const getRandomImage = () => {
  return randomImages[Math.floor(Math.random() * randomImages.length)];
};

export const getSavingCategories = (): SavingCategory[] => savingCategories;

export const addSavingCategory = (
  category: Omit<SavingCategory, "id" | "createdAt">
): SavingCategory => {
  const newCategory = {
    id: uuidv4(),
    ...category,
    imageUrl: category.imageUrl || getRandomImage(),
    createdAt: new Date().toISOString(),
  };
  savingCategories.push(newCategory);
  return newCategory;
};

export const updateSavingCategory = (
  id: string,
  updatedCategory: Partial<SavingCategory>
): SavingCategory | null => {
  const index = savingCategories.findIndex((cat) => cat.id === id);
  if (index !== -1) {
    savingCategories[index] = {
      ...savingCategories[index],
      ...updatedCategory,
      updatedAt: new Date().toISOString(),
    };
    return savingCategories[index];
  }
  return null;
};

export const deleteSavingCategory = (id: string): void => {
  savingCategories = savingCategories.filter((cat) => cat.id !== id);
};
export const getSavings = (): Saving[] => savings;

export const addSaving = (saving: Omit<Saving, "id" | "createdAt">): Saving => {
  const newSaving: Saving = {
    id: uuidv4(),
    ...saving,
    createdAt: new Date().toISOString(),
  };
  savings.push(newSaving);
  return newSaving;
};

export const updateSaving = (
  id: string,
  updatedSaving: Partial<Saving>
): Saving | null => {
  const index = savings.findIndex((saving) => saving.id === id);
  if (index !== -1) {
    savings[index] = {
      ...savings[index],
      ...updatedSaving,
      updatedAt: new Date().toISOString(),
    };
    return savings[index];
  }
  return null;
};

export const deleteSaving = (id: string): void => {
  savings = savings.filter((saving) => saving.id !== id);
};

export const getTotalSavings = (): number => {
  return savings.reduce((total, saving) => total + saving.amount, 0);
};

export const getSavingsByMonth = (
  months: number = 6
): { month: string; amount: number }[] => {
  const result: { month: string; amount: number }[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

    const monthlySavings = savings.filter((saving) => {
      const savingDate = new Date(saving.date);
      return (
        savingDate.getFullYear() === date.getFullYear() &&
        savingDate.getMonth() === date.getMonth()
      );
    });

    result.push({
      month: `${date.getMonth() + 1}/${date.getFullYear()}`,
      amount: monthlySavings.reduce((sum, saving) => sum + saving.amount, 0),
    });
  }

  return result;
};

export const getSavingsByCategory = (): {
  category: SavingCategory;
  amount: number;
}[] => {
  const result: { category: SavingCategory; amount: number }[] = [];

  savingCategories.forEach((category) => {
    const categorySavings = savings.filter(
      (saving) => saving.categoryId === category.id
    );
    const total = categorySavings.reduce(
      (sum, saving) => sum + saving.amount,
      0
    );

    if (total > 0) {
      result.push({
        category,
        amount: total,
      });
    }
  });

  return result;
};

export const getCurrentMonthSavings = (): number => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return savings
    .filter((saving) => {
      const savingDate = new Date(saving.date);
      return (
        savingDate.getMonth() === currentMonth &&
        savingDate.getFullYear() === currentYear
      );
    })
    .reduce((total, saving) => total + saving.amount, 0);
};
