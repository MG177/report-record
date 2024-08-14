import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/utils/dbConnect'
import Report, { IReport } from '@/models/Report'
import formidable from 'formidable'
import fs from 'fs/promises'

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req: NextRequest) {
  await dbConnect()
  try {
    const formData = await req.formData()

    // Extract data from formData
    const title = formData.get('title') as string
    const date = new Date(formData.get('date') as string)
    const description = formData.get('description') as string
    const images: File[] = formData.getAll('images') as unknown as File[]

    // Handle file uploads separately if needed
    const imagesURL = await Promise.all(
      images.map(async (image) => {
        const data = await image.arrayBuffer()
        const fileName = `${Date.now()}-${image.name}`

        await fs.writeFile(`./public/uploads/${fileName}`, Buffer.from(data))
        return `/uploads/${fileName}`
      })
    )

    // Create a new report instance
    const report = new Report({ title, date, description, imagesURL })
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
    const reports: IReport[] = await Report.find({}).lean()
    return NextResponse.json(reports, { status: 200 })
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: 'Error fetching reports' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect()
  try {
    const { id, ...updateData } = await req.json()
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

export async function DELETE(req: NextRequest) {
  await dbConnect()
  try {
    const { id } = await req.json()
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
