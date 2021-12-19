import { Schema, Document, model } from 'mongoose';

export interface IUsers extends Document {
  journal: Schema.Types.ObjectId[],
  name: string,
};

export const UsersSchema = new Schema({
  journal: [{ type: Schema.Types.ObjectId, ref: 'Journal' }],
  name: { type: String, required: true },
});

const Users = model<IUsers>('Users', UsersSchema);
export default Users;