import mongoose, { Document } from 'mongoose'

export interface IReport extends Document {
  title: string
  description: string
  files: any[]
  createdAt: Date
}

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  files: { type: [mongoose.Schema.Types.Mixed] },
  createdAt: { type: Date, default: Date.now },
})

const Report =
  mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema)

export default Report
