import { Schema, model } from "mongoose";
import {SavingCategory as ISavingCategory} from "../types/saving"
const SavingCategorySchema = new Schema<ISavingCategory>({
  name: { type: String, required: true },
  color: { type: String, required: true },
  icon: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const SavingCategory = model<ISavingCategory>(
  "SavingCategory",
  SavingCategorySchema
);
