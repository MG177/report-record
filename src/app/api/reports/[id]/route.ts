import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/utils/dbConnect'
import Report from '@/models/Report'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect()
  try {
    const id = params.id
    const report = await Report.findById(id).lean()

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    return NextResponse.json(report, { status: 200 })
  } catch (error) {
    console.error('Error fetching report:', error)
    return NextResponse.json(
      { error: 'Error fetching report' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect()
  try {
    const id = params.id
    const updateData = await req.json()
    console.log(id, updateData)

    const updatedReport = await Report.findByIdAndUpdate(id, updateData, {
      new: true,
    })
    if (!updatedReport) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }
    return NextResponse.json(updatedReport, { status: 200 })
  } catch (error) {
    console.error('Error updating report:', error)
    return NextResponse.json(
      { error: 'Error updating report' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect()
  try {
    const id = params.id
    const deletedReport = await Report.findByIdAndDelete(id)
    if (!deletedReport) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }
    return NextResponse.json(
      { message: 'Report deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting report:', error)
    return NextResponse.json(
      { error: 'Error deleting report' },
      { status: 500 }
    )
  }
}
