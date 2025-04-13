/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/lib/data.ts
import { v4 as uuid } from "uuid";
import { Couple } from "../types/couple";
import { Plan } from "../types/plan";
import { randomImages, Saving, SavingCategory } from "../types/saving";
import fs from "fs/promises";
import path from "path";

// Đường dẫn tới file JSON lưu trữ dữ liệu
const DATA_FILE = path.join(process.cwd(), "data.json");

const readData = async (): Promise<{
  coupleData: Couple;
  plans: Plan[];
  savingCategories: SavingCategory[];
  savings: Saving[];
}> => {
  try {
    const fileContent = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(fileContent);
    console.log("Parsed data from file:", parsed);
    return {
      coupleData: parsed.coupleData || { startDate: new Date().toISOString() },
      plans: Array.isArray(parsed.plans) ? parsed.plans : [],
      savingCategories: Array.isArray(parsed.savingCategories)
        ? parsed.savingCategories
        : [
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
              imageUrl:
                "https://img.icons8.com/color/96/investment-portfolio.png",
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
          ],
      savings: Array.isArray(parsed.savings) ? parsed.savings : [],
    };
  } catch (error) {
    console.error("Error reading data file:", error);
    return {
      coupleData: { startDate: new Date().toISOString() },
      plans: [],
      savingCategories: [
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
      ],
      savings: [],
    };
  }
};

const writeData = async (data: {
  coupleData: Couple;
  plans: Plan[];
  savingCategories: SavingCategory[];
  savings: Saving[];
}) => {
  try {
    console.log("Writing to data.json at:", DATA_FILE);
    console.log("Data to write:", {
      coupleData: data.coupleData,
      plans: data.plans,
      savingCategories: data.savingCategories,
      savings: data.savings,
    });
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    console.log("Successfully wrote to data.json");
    // Đọc lại file để xác nhận
    const fileContent = await fs.readFile(DATA_FILE, "utf-8");
    console.log("File content after write:", JSON.parse(fileContent));
  } catch (error) {
    console.error("Error writing to data file:", error);
    throw error;
  }
};

/*
---
Couple functions
---
*/
export const getCoupleData = async (): Promise<Couple> => {
  const data = await readData();
  return data.coupleData;
};

export const updateCoupleData = async (
  newData: Partial<Couple>
): Promise<Couple> => {
  const data = await readData();
  data.coupleData = { ...data.coupleData, ...newData };
  await writeData(data);
  return data.coupleData;
};

/*
---
Plans functions
---
*/
export const getPlans = async (): Promise<Plan[]> => {
  const data = await readData();
  return data.plans;
};

export const addPlan = async (
  plan: Omit<Plan, "id" | "createdAt">
): Promise<Plan> => {
  console.log("Starting addPlan with input:", plan);
  const data = await readData();
  console.log("Data read from file:", {
    savings: data.savings,
    plans: data.plans,
  });
  const newPlan: Plan = {
    id: uuid(),
    ...plan,
    createdAt: new Date().toISOString(),
  };
  console.log("New plan to add:", newPlan);
  data.plans = Array.isArray(data.plans) ? [...data.plans, newPlan] : [newPlan];
  console.log("Updated data.plans:", data.plans);
  await writeData(data);
  console.log("addPlan completed, final data.plans:", data.plans);
  return newPlan;
};

export const updatePlan = async (
  id: string,
  updatedPlan: Partial<Plan>
): Promise<Plan | null> => {
  const data = await readData();
  const index = data.plans.findIndex((plan) => plan.id === id);
  if (index !== -1) {
    data.plans[index] = { ...data.plans[index], ...updatedPlan };
    await writeData(data);
    return data.plans[index];
  }
  return null;
};

export const deletePlan = async (id: string): Promise<void> => {
  const data = await readData();
  data.plans = data.plans.filter((plan) => plan.id !== id);
  await writeData(data);
};

export const getUpcomingPlans = async (): Promise<Plan[]> => {
  const data = await readData();
  return data.plans
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

export const getSavingCategories = async (): Promise<SavingCategory[]> => {
  const data = await readData();
  return data.savingCategories;
};

export const addSavingCategory = async (
  category: Omit<SavingCategory, "id" | "createdAt">
): Promise<SavingCategory> => {
  const data = await readData();
  const newCategory: SavingCategory = {
    id: uuid(),
    ...category,
    imageUrl: category.imageUrl || getRandomImage(),
    createdAt: new Date().toISOString(),
  };
  data.savingCategories = [...data.savingCategories, newCategory];
  await writeData(data);
  return newCategory;
};

export const updateSavingCategory = async (
  id: string,
  updatedCategory: Partial<SavingCategory>
): Promise<SavingCategory | null> => {
  const data = await readData();
  const index = data.savingCategories.findIndex((cat) => cat.id === id);
  if (index !== -1) {
    data.savingCategories[index] = {
      ...data.savingCategories[index],
      ...updatedCategory,
      updatedAt: new Date().toISOString(),
    };
    await writeData(data);
    return data.savingCategories[index];
  }
  return null;
};

export const deleteSavingCategory = async (id: string): Promise<void> => {
  const data = await readData();
  data.savingCategories = data.savingCategories.filter((cat) => cat.id !== id);
  await writeData(data);
};

export const getSavings = async (): Promise<Saving[]> => {
  const data = await readData();
  return data.savings;
};

export const addSaving = async (
  saving: Omit<Saving, "id" | "createdAt">
): Promise<Saving> => {
  console.log("Starting addSaving with input:", saving);
  const data = await readData();
  console.log("Data read from file:", {
    savings: data.savings,
    plans: data.plans,
  });
  const newSaving: Saving = {
    id: uuid(),
    ...saving,
    createdAt: new Date().toISOString(),
  };
  console.log("New saving to add:", newSaving);
  data.savings = Array.isArray(data.savings)
    ? [...data.savings, newSaving]
    : [newSaving];
  console.log("Updated data.savings:", data.savings);
  await writeData(data);
  console.log("addSaving completed, final data.savings:", data.savings);
  return newSaving;
};


export const updateSaving = async (
  id: string,
  updatedSaving: Partial<Saving>
): Promise<Saving | null> => {
  const data = await readData();
  const index = data.savings.findIndex((saving) => saving.id === id);
  if (index !== -1) {
    data.savings[index] = {
      ...data.savings[index],
      ...updatedSaving,
      updatedAt: new Date().toISOString(),
    };
    await writeData(data);
    return data.savings[index];
  }
  return null;
};

export const deleteSaving = async (id: string): Promise<void> => {
  const data = await readData();
  data.savings = data.savings.filter((saving) => saving.id !== id);
  await writeData(data);
};

export const getTotalSavings = async (): Promise<number> => {
  const data = await readData();
  return data.savings.reduce((total, saving) => total + saving.amount, 0);
};

export const getSavingsByMonth = async (
  months: number = 6
): Promise<{ month: string; amount: number }[]> => {
  const data = await readData();
  const result: { month: string; amount: number }[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

    const monthlySavings = data.savings.filter((saving) => {
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

export const getSavingsByCategory = async (): Promise<
  { category: SavingCategory; amount: number }[]
> => {
  const data = await readData();
  const result: { category: SavingCategory; amount: number }[] = [];

  data.savingCategories.forEach((category) => {
    const categorySavings = data.savings.filter(
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

export const getCurrentMonthSavings = async (): Promise<number> => {
  const data = await readData();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return data.savings
    .filter((saving) => {
      const savingDate = new Date(saving.date);
      return (
        savingDate.getMonth() === currentMonth &&
        savingDate.getFullYear() === currentYear
      );
    })
    .reduce((total, saving) => total + saving.amount, 0);
};
