import mongoose, { Schema, Document, Model } from 'mongoose';
import { CandidateStage } from '@/lib/types';

export interface ICandidateDoc extends Document {
  name: string;
  email: string;
  phone: string;
  role: string;
  stage: CandidateStage;
  skills: string[];
  resumeUrl: string;
  experience: number;
  rating: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema = new Schema<ICandidateDoc>(
  {
    name: {
      type: String,
      required: [true, 'Please provide the candidate name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide a valid email address'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Please provide the target role'],
      trim: true,
      index: true,
    },
    stage: {
      type: String,
      enum: {
        values: ['Applied', 'Screening', 'Technical Interview', 'Offered', 'Rejected'],
        message: '{VALUE} is not a valid hiring stage',
      },
      default: 'Applied',
      index: true,
    },
    skills: {
      type: [String],
      default: [],
      index: true,
    },
    resumeUrl: {
      type: String,
      trim: true,
      default: '',
    },
    experience: {
      type: Number,
      required: [true, 'Please specify years of experience'],
      min: [0, 'Experience cannot be negative'],
      default: 0,
      index: true,
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      default: 3,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high performance search, filtering, and sorting
CandidateSchema.index({ name: 'text', role: 'text', notes: 'text' });
CandidateSchema.index({ createdAt: -1 });
CandidateSchema.index({ stage: 1, role: 1 });

export const Candidate: Model<ICandidateDoc> =
  mongoose.models.Candidate || mongoose.model<ICandidateDoc>('Candidate', CandidateSchema);

export default Candidate;
