import { Schema, model } from "mongoose";
import {Couple as ICouple} from "../types/couple"

const CoupleSchema = new Schema<ICouple>({
  startDate: { type: Date, required: true, default: Date.now },
});

export const Couple = model<ICouple>("Couple", CoupleSchema);
