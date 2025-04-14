/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ObjectId } from "mongodb";

import { v4 as uuid } from "uuid";
import { Couple as ICouple } from "../types/couple";
import { Plan } from "../types/plan";
import { randomImages, Saving, SavingCategory } from "../types/saving";
import db from "./db";

const COUPLE_COLLECTION = "couples";
const PLANS_COLLECTION = "plans";
const SAVING_CATEGORIES_COLLECTION = "savingCategories";
const SAVINGS_COLLECTION = "savings";

async function getDatabase() {
  const client = await db;
  return client.db();
}

/*
---
Couple functions
---
*/
export const getCoupleData = async (): Promise<ICouple> => {
  const database = await getDatabase();

  const couple = await database
    .collection<ICouple>(COUPLE_COLLECTION)
    .findOne({});

  if (!couple) {
    const defaultCouple: ICouple = {
      _id: new ObjectId(),
      startDate: new Date().toISOString(),
    };

    const insertResult = await database
      .collection(COUPLE_COLLECTION)
      .insertOne(defaultCouple);

    return {
      ...defaultCouple,
    };
  }
  return {
    _id: couple._id,
    startDate: couple.startDate || new Date().toISOString(),
  };
};

export const updateCoupleData = async (newData: ICouple): Promise<ICouple> => {
  const database = await getDatabase();

  const couple = await database.collection(COUPLE_COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(newData._id as string) },
    {
      $set: {
        startDate: newData.startDate,
        updatedAt: new Date().toISOString(),
      },
    },
    { returnDocument: "after" }
  );
  return couple as ICouple;
};

/*
---
Plans functions
---
*/
export const getPlans = async (): Promise<Plan[]> => {
  const database = await getDatabase();

  const plans = await database
    .collection<Plan>(PLANS_COLLECTION)
    .find()
    .sort({ date: 1 })
    .toArray();

  if (!plans || plans.length === 0) {
    return [];
  }

  return plans as Plan[];
};

export const addPlan = async (plan: Omit<Plan, "createdAt">): Promise<Plan> => {
  const database = await getDatabase();
  const newPlan: Plan = {
    ...plan,
    createdAt: new Date().toISOString(),
  };

  await database.collection(PLANS_COLLECTION).insertOne(newPlan);
  return newPlan;
};

export const updatePlan = async (
  id: string,
  updatedPlan: Partial<Plan>
): Promise<Plan | null> => {
  const database = await getDatabase();
  const result = await database
    .collection(PLANS_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updatedPlan, updatedAt: new Date().toISOString() } },
      { returnDocument: "after" }
    );
  return result as Plan;
};

export const deletePlan = async (id: string): Promise<void> => {
  const database = await getDatabase();
  await database
    .collection(PLANS_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
};

export const getUpcomingPlans = async (): Promise<Plan[]> => {
  const database = await getDatabase();

  const plans = await database
    .collection<Plan>(PLANS_COLLECTION)
    .find({ completed: false })
    .sort({ date: 1 })
    .toArray();

  if (!plans || plans.length === 0) {
    return [];
  }

  return plans as Plan[];
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
  const database = await getDatabase();

  // Sử dụng generic type để chỉ định kiểu dữ liệu
  const categories = await database
    .collection<SavingCategory>(SAVING_CATEGORIES_COLLECTION)
    .find()
    .toArray();

  // Nếu không có categories, tạo categories mặc định
  if (categories.length === 0) {
    const defaultCategories: SavingCategory[] = [
      {
        name: "Tiền mặt",
        color: "#4ade80",
        icon: "money-bill",
        imageUrl: "https://img.icons8.com/color/96/money.png",
        createdAt: new Date().toISOString(),
      },
      {
        name: "Đầu tư",
        color: "#3b82f6",
        icon: "chart-line",
        imageUrl: "https://img.icons8.com/color/96/investment-portfolio.png",
        createdAt: new Date().toISOString(),
      },
      {
        name: "Vàng",
        color: "#f59e0b",
        icon: "gem",
        imageUrl: "https://img.icons8.com/color/96/gold-bars.png",
        createdAt: new Date().toISOString(),
      },
    ];

    await database
      .collection<SavingCategory>(SAVING_CATEGORIES_COLLECTION)
      .insertMany(defaultCategories);

    return defaultCategories;
  }

  return categories;
};

export const addSavingCategory = async (
  category: Omit<SavingCategory, "createdAt">
): Promise<SavingCategory> => {
  const database = await getDatabase();
  const newCategory: SavingCategory = {
    ...category,
    imageUrl: category.icon
      ? `https://img.icons8.com/color/96/${category.icon}.png`
      : "https://img.icons8.com/color/96/bitcoin.png",
    createdAt: new Date().toISOString(),
  };

  await database
    .collection(SAVING_CATEGORIES_COLLECTION)
    .insertOne(newCategory);
  return newCategory;
};

export const updateSavingCategory = async (
  id: string,
  updatedCategory: Partial<SavingCategory>
): Promise<SavingCategory | null> => {
  const database = await getDatabase();
  const result = await database
    .collection(SAVING_CATEGORIES_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updatedCategory, updatedAt: new Date().toISOString() } },
      { returnDocument: "after" }
    );

  return result as SavingCategory;
};

export const deleteSavingCategory = async (id: string): Promise<void> => {
  const database = await getDatabase();
  await database
    .collection(SAVING_CATEGORIES_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
  // Also remove savings in this category
  await database
    .collection(SAVINGS_COLLECTION)
    .deleteMany({ categoryId: new ObjectId(id) });
};

export const getSavings = async (): Promise<Saving[]> => {
  const database = await getDatabase();

  // Sử dụng generic type và populate category nếu cần
  const savings = await database
    .collection<Saving & { categoryId: string }>(SAVINGS_COLLECTION)
    .find()
    .sort({ date: -1 })
    .toArray();

  const categories = await getSavingCategories();

  return savings.map((saving) => {
    const category = categories.find((cat) => cat._id === saving.categoryId);

    return {
      _id: saving._id,
      amount: saving.amount,
      date: saving.date,
      description: saving.description || "",
      categoryId: saving.categoryId,
      category: category
        ? {
            _id: category._id,
            name: category.name,
            color: category.color,
            icon: category.icon,
            imageUrl: category.imageUrl,
          }
        : undefined,
      createdAt: saving.createdAt || new Date().toISOString(),
      updatedAt: saving.updatedAt,
    };
  });
};

export const addSaving = async (
  saving: Omit<Saving, "createdAt">
): Promise<Saving> => {
  const database = await getDatabase();
  const newSaving: Saving = {
    ...saving,
    createdAt: new Date().toISOString(),
  };

  await database.collection(SAVINGS_COLLECTION).insertOne(newSaving);
  return newSaving;
};

export const updateSaving = async (
  id: string,
  updatedSaving: Partial<Saving>
): Promise<Saving | null> => {
  const database = await getDatabase();
  const result = await database
    .collection(SAVINGS_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updatedSaving, updatedAt: new Date().toISOString() } },
      { returnDocument: "after" }
    );

  return result as Saving;
};

export const deleteSaving = async (id: string): Promise<void> => {
  const database = await getDatabase();
  await database
    .collection(SAVINGS_COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
};

export const getTotalSavings = async (): Promise<number> => {
  const database = await getDatabase();
  const result = await database
    .collection(SAVINGS_COLLECTION)
    .aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ])
    .toArray();

  return result[0]?.total || 0;
};

export const getSavingsByMonth = async (
  months: number = 6
): Promise<{ month: string; amount: number }[]> => {
  const database = await getDatabase();
  const now = new Date();
  const result: { month: string; amount: number }[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const monthlySavings = await database
      .collection(SAVINGS_COLLECTION)
      .aggregate([
        {
          $match: {
            date: {
              $gte: startDate.toISOString(),
              $lte: endDate.toISOString(),
            },
          },
        },
        {
          $group: {
            _id: null,
            amount: { $sum: "$amount" },
          },
        },
      ])
      .toArray();

    result.push({
      month: `${date.getMonth() + 1}/${date.getFullYear()}`,
      amount: monthlySavings[0]?.amount || 0,
    });
  }

  return result;
};

export const getSavingsByCategory = async (): Promise<
  { category: SavingCategory; amount: number }[]
> => {
  const database = await getDatabase();
  const categories = await getSavingCategories();
  const result: { category: SavingCategory; amount: number }[] = [];

  for (const category of categories) {
    const categorySavings = await database
      .collection(SAVINGS_COLLECTION)
      .aggregate([
        {
          $match: {
            categoryId: new ObjectId(category._id as string).toString(),
          },
        },
        {
          $group: {
            _id: null,
            amount: { $sum: "$amount" },
          },
        },
      ])
      .toArray();

    const total = categorySavings[0]?.amount || 0;
    if (total > 0) {
      result.push({
        category,
        amount: total,
      });
    }
  }

  return result;
};

export const getCurrentMonthSavings = async (): Promise<number> => {
  const database = await getDatabase();
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const result = await database
    .collection(SAVINGS_COLLECTION)
    .aggregate([
      {
        $match: {
          date: {
            $gte: startDate.toISOString(),
            $lte: endDate.toISOString(),
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ])
    .toArray();

  return result[0]?.total || 0;
};
