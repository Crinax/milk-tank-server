import { Schema, Document, model } from 'mongoose';

export interface IJournal extends Document {
  userId: Schema.Types.ObjectId,
  litters: number,
  tankId: Schema.Types.ObjectId,
};

export const JournalSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Users' },
  litters: Number,
  tankId: { type: Schema.Types.ObjectId, ref: 'Tanks' },
});

const Journal = model<IJournal>('Journal', JournalSchema);
export default Journal;