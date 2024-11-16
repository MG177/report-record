import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/utils/dbConnect'
import Report, { IReport } from '@/models/Report'

export async function POST(req: NextRequest) {
  await dbConnect()
  try {
    const body = await req.json()
    const report = new Report(body)
    await report.save()
    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error('Error creating report:', error)
    return NextResponse.json(
      { error: 'Error creating report' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  await dbConnect()
  try {
    const searchParams = req.nextUrl.searchParams
    const sortField = searchParams.get('sort') || 'date'
    const sortOrder = searchParams.get('order') === 'asc' ? 1 : -1
    const searchTerm = searchParams.get('search') || ''
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let query: any = {}

    // Handle search term
    if (searchTerm) {
      query.$or = [
        { location: { $regex: searchTerm, $options: 'i' } },
        { problem: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ]
    }

    // Handle date range
    if (startDate || endDate) {
      query.date = {}
      if (startDate) {
        query.date.$gte = new Date(startDate)
      }
      if (endDate) {
        query.date.$lte = new Date(endDate)
      }
    }

    console.log('Query:', JSON.stringify(query, null, 2))
    console.log('Date Range:', { startDate, endDate })

    const reports: IReport[] = await Report.find(query)
      .sort({ [sortField]: sortOrder })
      .lean()

    console.log('Found reports:', reports.length)

    return NextResponse.json(reports, { status: 200 })
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: 'Error fetching reports' },
      { status: 500 }
    )
  }
}
