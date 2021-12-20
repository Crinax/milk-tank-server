import { Schema, Document, model } from 'mongoose';

export interface ITanks extends Document {
  litters: number,
};

export const TanksSchema = new Schema({
  litters: { type: Number, required: true },
});

const Tanks = model<ITanks>('Tanks', TanksSchema);
export default Tanks;