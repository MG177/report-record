import mongoose, { Document, Schema } from 'mongoose'
import { ReportCreate } from '@lib/validations/report'
import { dbConnect } from '@utils/dbConnect'

export interface IReport {
  location: string
  problem: string
  solve: string
  images: string[]
  description: string
  date: Date
  status: 'pending' | 'in-progress' | 'resolved' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  createdAt: Date
  updatedAt: Date
}

export type ReportDocument = Document & IReport

const reportSchema = new Schema<ReportDocument>(
  {
    location: { type: String, required: true, index: true },
    problem: { type: String, required: true },
    solve: { type: String, required: true },
    description: { type: String, required: false },
    images: { type: [String], required: false },
    date: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved', 'cancelled'],
      default: 'pending',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true,
    },
  },
  { timestamps: true }
)

// Add text index for search
reportSchema.index(
  { location: 'text', problem: 'text', description: 'text' },
  { weights: { location: 3, problem: 2, description: 1 } }
)

export class ReportService {
  static async createReport(data: ReportCreate): Promise<ReportDocument> {
    await dbConnect()
    return await Report.create(data)
  }

  static async getReports(
    query: any,
    page = 1,
    limit = 10,
    sort = '-date'
  ): Promise<{
    reports: IReport[]
    total: number
    totalPages: number
    currentPage: number
  }> {
    try {
      console.log('ReportService.getReports called') // Debug log
      console.log('Query:', query) // Debug log
      console.log('Sort:', sort) // Debug log

      await dbConnect()
      console.log('Database connected successfully') // Debug log

      const skip = (page - 1) * limit
      console.log('Skip:', skip, 'Limit:', limit) // Debug log

      const [reports, total] = await Promise.all([
        Report.find(query).sort(sort).skip(skip).limit(limit).lean(),
        Report.countDocuments(query),
      ])

      console.log('Reports found:', reports.length) // Debug log
      console.log('Total count:', total) // Debug log

      return {
        reports: reports as unknown as IReport[],
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      }
    } catch (error) {
      console.error('ReportService.getReports error:', error) // Debug log
      throw error
    }
  }

  static async updateReport(
    id: string,
    data: Partial<ReportCreate>
  ): Promise<ReportDocument | null> {
    await dbConnect()
    return await Report.findByIdAndUpdate(id, data, { new: true })
  }

  static async deleteReport(id: string): Promise<ReportDocument | null> {
    await dbConnect()
    return await Report.findByIdAndDelete(id)
  }
}

const Report =
  mongoose.models.Report ||
  mongoose.model<ReportDocument>('Report', reportSchema)
export default Report
