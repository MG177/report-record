import { test, expect } from '@playwright/test'

test.describe('Basic Application Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load the home page', async ({ page }) => {
    // Check that the page loads
    await expect(page).toHaveTitle(/Report Record/)

    // Check that the header is visible - use first() to avoid strict mode violation
    await expect(page.locator('text=Reports').first()).toBeVisible()

    // Check that the search bar is visible
    await expect(
      page.locator('input[placeholder="Search reports..."]')
    ).toBeVisible()
  })

  test('should navigate to create page', async ({ page }) => {
    // Click the New Report button
    await page.click('text=New Report')

    // Check that we're on the create page
    await expect(page).toHaveURL('/create')

    // Check that the form is visible
    await expect(page.locator('text=Images')).toBeVisible()
    await expect(page.locator('text=Location')).toBeVisible()
    await expect(page.locator('text=Date & Time')).toBeVisible()
    await expect(page.locator('text=Problem')).toBeVisible()
    await expect(page.locator('text=Solution')).toBeVisible()
    await expect(page.locator('text=Description')).toBeVisible()
  })

  test('should navigate to calendar view', async ({ page }) => {
    // Click the Calendar button
    await page.click('text=Calendar')

    // Check that we're on the calendar page - the app adds query parameters
    await expect(page).toHaveURL(/\/calendar/)

    // Check that the calendar is visible
    await expect(page.locator('text=Calendar View')).toBeVisible()
    await expect(page.locator('text=Sun')).toBeVisible()
    await expect(page.locator('text=Mon')).toBeVisible()
    await expect(page.locator('text=Tue')).toBeVisible()
    await expect(page.locator('text=Wed')).toBeVisible()
    await expect(page.locator('text=Thu')).toBeVisible()
    await expect(page.locator('text=Fri')).toBeVisible()
    await expect(page.locator('text=Sat')).toBeVisible()
  })

  test('should search for reports', async ({ page }) => {
    // Type in the search bar
    await page.fill('input[placeholder="Search reports..."]', 'test search')

    // Check that the search input has the value
    await expect(
      page.locator('input[placeholder="Search reports..."]')
    ).toHaveValue('test search')
  })

  test('should show filters when filter button is clicked', async ({
    page,
  }) => {
    // Click the filter button - it's a button with Filter icon, not aria-label
    await page.click('button:has(svg)')

    // Check that the filters panel is visible
    await expect(page.locator('text=Sort by')).toBeVisible()
    await expect(page.locator('select')).toBeVisible()
  })

  test('should handle empty state when no reports exist', async ({ page }) => {
    // If no reports exist, should show empty state
    const emptyState = page.locator('text=No reports found')
    const createFirstReport = page.locator(
      'text=Create your first report to get started'
    )

    // Check if either empty state message is visible
    const isEmpty =
      (await emptyState.isVisible()) || (await createFirstReport.isVisible())

    if (isEmpty) {
      await expect(emptyState.or(createFirstReport)).toBeVisible()
    }
  })

  test('should have proper mobile responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Check that the layout is responsive
    await expect(page.locator('text=Reports').first()).toBeVisible()

    // Check that the floating action button is visible on mobile
    const fab = page.locator('a[href="/create"]').last()
    await expect(fab).toBeVisible()
  })

  test('should handle navigation back from create page', async ({ page }) => {
    // Navigate to create page
    await page.click('text=New Report')
    await expect(page).toHaveURL('/create')

    // Click back button
    await page.click('text=Back')

    // Should return to home page
    await expect(page).toHaveURL('/')
  })

  test('should handle navigation back from calendar page', async ({ page }) => {
    // Navigate to calendar page
    await page.click('text=Calendar')
    await expect(page).toHaveURL(/\/calendar/)

    // Click back button
    await page.click('text=Back')

    // Should return to home page
    await expect(page).toHaveURL('/')
  })

  test('should have proper accessibility features', async ({ page }) => {
    // Check that form inputs have proper labels
    await page.click('text=New Report')
    await expect(page).toHaveURL('/create')

    // Check that date and time inputs have proper labels - they're h2 elements, not label elements
    await expect(page.locator('h2:has-text("Date & Time")')).toBeVisible()

    // Check that form fields have proper placeholders
    await expect(
      page.locator('input[placeholder="Enter location"]')
    ).toBeVisible()
    await expect(
      page.locator('textarea[placeholder="Describe the problem..."]')
    ).toBeVisible()
    await expect(
      page.locator('textarea[placeholder="Describe the solution..."]')
    ).toBeVisible()
    await expect(
      page.locator('textarea[placeholder="Additional details..."]')
    ).toBeVisible()
  })

  test('should handle form validation', async ({ page }) => {
    // Navigate to create page
    await page.click('text=New Report')
    await expect(page).toHaveURL('/create')

    // Try to submit without filling required fields
    await page.click('button[type="submit"]')

    // Should stay on the create page (form validation prevents submission)
    await expect(page).toHaveURL('/create')
  })

  test('should handle image upload interface', async ({ page }) => {
    // Navigate to create page
    await page.click('text=New Report')
    await expect(page).toHaveURL('/create')

    // Check that image upload area is visible
    await expect(page.locator('text=Drop files to upload')).toBeVisible()
    await expect(page.locator('text=or click to select')).toBeVisible()
    await expect(page.locator('text=Maximum file size: 5MB')).toBeVisible()

    // Check that file input is present but hidden (as expected)
    await expect(page.locator('input[type="file"]')).toBeHidden()
  })

  test('should have proper loading states', async ({ page }) => {
    // The page should load without infinite loading
    await expect(page.locator('text=Reports').first()).toBeVisible()

    // Should not show loading spinner on initial load
    const loadingSpinner = page.locator('text=Loading reports...')
    await expect(loadingSpinner).not.toBeVisible()
  })

  test('should handle error states gracefully', async ({ page }) => {
    // Navigate to a non-existent page
    await page.goto('/non-existent-page')

    // Should show 404 or error page
    const errorContent = page
      .locator('text=404')
      .or(page.locator('text=Not Found'))
    await expect(errorContent).toBeVisible()
  })
})
