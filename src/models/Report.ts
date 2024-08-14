import mongoose, { Document } from 'mongoose'

export interface IReport extends Document {
  _id: string
  title: string
  description: string
  date: Date
  imagesURL: string[]
  createdAt: Date
}

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: Date,
  description: { type: String, required: true },
  imagesURL: { type: [String] },
  createdAt: { type: Date, default: Date.now },
})

const Report =
  mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema)

export default Report
