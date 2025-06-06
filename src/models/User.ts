import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  emailVerified?: Date;
  createdAt: Date;
  urlCount: number;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  emailVerified: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  urlCount: {
    type: Number,
    default: 0,
  },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
