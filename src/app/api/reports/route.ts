import { NextRequest, NextResponse } from 'next/server'
import { ReportService } from '@/models/Report'
import { reportCreateSchema, reportQuerySchema } from '@lib/validations/report'
import { ZodError } from 'zod'

// Error handler utility
const handleError = (error: unknown) => {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: 'Validation error', details: error.errors },
      { status: 400 }
    )
  }

  console.error('API Error:', error)
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = reportCreateSchema.parse(body)
    const report = await ReportService.createReport(validatedData)

    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const validatedQuery = reportQuerySchema.parse({
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 10,
      sort: searchParams.get('sort') || 'date',
      order: searchParams.get('order') || 'desc',
      search: searchParams.get('search') || '',
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      status: searchParams.get('status') || undefined,
      priority: searchParams.get('priority') || undefined,
    })

    const {
      page,
      limit,
      sort,
      order,
      search,
      startDate,
      endDate,
      status,
      priority,
    } = validatedQuery

    // Build query
    let query: any = {}
    let sortOptions = `${order === 'desc' ? '-' : ''}${sort}`

    // Handle search term
    if (search) {
      query.$text = { $search: search }
    }

    // Handle date range
    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = new Date(startDate)
      if (endDate) query.date.$lte = new Date(endDate)
    }

    // Handle status and priority filters
    if (status) query.status = status
    if (priority) query.priority = priority

    const result = await ReportService.getReports(
      query,
      page,
      limit,
      sortOptions
    )

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
  } catch (error) {
    return handleError(error)
  }
}

// Add PATCH endpoint for updating reports
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const id = req.nextUrl.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      )
    }

    const validatedData = reportCreateSchema.partial().parse(body)
    const updatedReport = await ReportService.updateReport(id, validatedData)

    if (!updatedReport) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    return NextResponse.json(updatedReport, { status: 200 })
  } catch (error) {
    return handleError(error)
  }
}

// Add DELETE endpoint
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      )
    }

    const deletedReport = await ReportService.deleteReport(id)

    if (!deletedReport) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return handleError(error)
  }
}
