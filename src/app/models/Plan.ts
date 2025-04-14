import { Schema, model } from "mongoose";
import { Plan as IPLan } from "../types/plan";

const PlanSchema = new Schema<IPLan>({
  title: { type: String, required: true },
  description: {type: String},
  date: { type: String, required: true },
  location: {type: String},
  budget: { type : Number},
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Plan = model<IPLan>("Plan", PlanSchema);
