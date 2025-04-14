import { Schema, model } from "mongoose";

export interface ISaving {
  amount: number;
  date: Date;
  description?: string;
  category: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt?: Date;
}

const SavingSchema = new Schema<ISaving>({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: {type : String},
  category: {
    type: Schema.Types.ObjectId,
    ref: "SavingCategory",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export const Saving = model<ISaving>("Saving", SavingSchema);
