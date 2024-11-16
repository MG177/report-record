import mongoose, { Document } from 'mongoose'

export interface IReport extends Document {
  readonly _id: string
  description: string
  date: Date
  location: string
  problem: String
  solve: String
  images: string[] // array of base64 image strings
  readonly createdAt: Date
}

export interface ReportFormData {
  title: string
  description: string
  date: Date
  location: string
  problem: string
  solve: string
  images: string[] // array of base64 image strings
}

const ReportSchema = new mongoose.Schema({
  description: { type: String, default: '' },
  date: { type: Date },
  location: { type: String, default: '', required: true },
  problem: { type: String, default: '' },
  solve: { type: String, default: '' },
  images: [{ type: String }], // array of base64 strings
  createdAt: { type: Date, default: Date.now },
})

const Report =
  mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema)

export default Report
