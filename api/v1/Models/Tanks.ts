import { Schema, Document, model } from 'mongoose';

export interface ITanks extends Document {
  journal: Schema.Types.ObjectId[],
  litters: number,
};

export const TanksSchema = new Schema({
  journal: [{ type: Schema.Types.ObjectId, ref: 'Journal' }],
  litters: { type: Number, required: true },
});

const Tanks = model<ITanks>('Tanks', TanksSchema);
export default Tanks;