import mongoose, { Document } from 'mongoose'

export interface IReport extends Document {
  readonly _id: string
  title: string
  description: string
  date: Date
  location: string
  problem: String
  solve: String
  readonly createdAt: Date
}

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '-' },
  date: { type: Date },
  location: { type: String, default: '-' },
  problem: { type: String, default: '-' },
  solve: { type: String, default: '-' },
  createdAt: { type: Date, default: Date.now },
})

const Report =
  mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema)

export default Report
