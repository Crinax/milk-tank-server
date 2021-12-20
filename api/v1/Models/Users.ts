import { Schema, Document, model } from 'mongoose';

export interface IUsers extends Document {
  name: string,
};

export const UsersSchema = new Schema({
  name: { type: String, required: true },
});

const Users = model<IUsers>('Users', UsersSchema);
export default Users;