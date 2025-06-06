import mongoose, { Document, Schema } from 'mongoose';

export interface IUrl extends Document {
  originalUrl: string;
  shortCode: string;
  customCode?: string;
  userId: string;
  title?: string;
  description?: string;
  clicks: number;
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

const UrlSchema = new Schema<IUrl>({
  originalUrl: {
    type: String,
    required: true,
    trim: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  customCode: {
    type: String,
    trim: true,
    sparse: true,
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Index for efficient queries
UrlSchema.index({ userId: 1, createdAt: -1 });
UrlSchema.index({ shortCode: 1 });

export default mongoose.models.Url || mongoose.model<IUrl>('Url', UrlSchema);
