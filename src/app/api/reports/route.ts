import { NextResponse } from 'next/server'
import { dbConnect } from '@/utils/dbConnect'
import Report, { IReport } from '@/models/Report'

export async function GET() {
  await dbConnect()
  try {
    const reports: IReport[] = await Report.find({}).lean()
    return NextResponse.json(reports, { status: 200 })
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json({ error: 'Error fetching reports' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  await dbConnect()
  try {
    const body: Partial<IReport> = await request.json()
    const report: IReport = await Report.create(body)
    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error('Error creating report:', error)
    return NextResponse.json({ error: 'Error creating report' }, { status: 500 })
  }
}
