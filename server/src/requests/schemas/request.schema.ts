import { Schema, Document } from 'mongoose';

export interface IRequest extends Document {
  name: string;
  email: string;
  message: string;
  category?: 'billing' | 'support' | 'feedback' | 'general' | null;
  summary?: string | null;
  urgency?: 'low' | 'medium' | 'high' | null;
  createdAt: Date;
  updatedAt: Date;
}

export const RequestSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['billing', 'support', 'feedback', 'general'],
      default: null,
    },
    summary: {
      type: String,
      default: null,
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: null,
    },
  },
  {
    timestamps: true,
  },
);
