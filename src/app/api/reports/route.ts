import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/utils/dbConnect'
import Report, { IReport } from '@/models/Report'
import formidable from 'formidable'
import fs from 'fs/promises'

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }

export async function POST(req: NextRequest) {
  await dbConnect()
  try {
    const body = await req.json()

    // Extract data from JSON body

    const report = new Report({
      ...body,
      date: new Date(body.date),
    })
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

    if (searchTerm) {
      query.title = { $regex: searchTerm, $options: 'i' }
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }

    const reports: IReport[] = await Report.find(query)
      .sort({ [sortField]: sortOrder })
      .lean()

    return NextResponse.json(reports, { status: 200 })
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: 'Error fetching reports' },
      { status: 500 }
    )
  }
}


