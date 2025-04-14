import { beforeEach, describe, expect, test, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { router } from '../router'
import { f1Api } from '../services/f1Api'
import { createTestQueryClient } from '../test/setup'

// Mock the f1Api
vi.mock('../services/f1Api', () => ({
  f1Api: {
    getConstructors: vi.fn(),
  },
}))

const renderWithProviders = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>,
  )
}

describe('Constructors', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock response for all tests
    const defaultMockConstructors = {
      MRData: {
        ConstructorTable: {
          Constructors: [],
        },
      },
    }

    vi.mocked(f1Api.getConstructors).mockResolvedValue(defaultMockConstructors)
  })

  test('renders page title', async () => {
    renderWithProviders(<RouterProvider router={router} />)
    const constructorsLink = screen.getByRole('link', { name: 'Constructors' })
    fireEvent.click(constructorsLink)
    expect(await screen.findByText('F1 Constructors 2024')).toBeDefined()
  })

  test('renders loading state initially', async () => {
    // Override the default mock to simulate loading
    vi.mocked(f1Api.getConstructors).mockImplementation(
      () => new Promise(() => {}),
    )

    renderWithProviders(<RouterProvider router={router} />)
    const constructorsLink = screen.getByRole('link', { name: 'Constructors' })
    fireEvent.click(constructorsLink)
    expect(await screen.findByText('Loading...')).toBeDefined()
  })

  test('renders constructor list when data is loaded', async () => {
    // Mock the API response
    const mockConstructors = {
      MRData: {
        ConstructorTable: {
          Constructors: [
            {
              constructorId: 'red_bull',
              url: 'http://example.com/red-bull',
              name: 'Red Bull Racing',
              nationality: 'Austrian',
            },
          ],
        },
      },
    }

    vi.mocked(f1Api.getConstructors).mockResolvedValueOnce(mockConstructors)

    renderWithProviders(<RouterProvider router={router} />)
    const constructorsLink = screen.getByRole('link', { name: 'Constructors' })
    fireEvent.click(constructorsLink)

    // Wait for constructor data to load
    const constructorName = await screen.findByText('Red Bull Racing')
    expect(constructorName).toBeDefined()

    // Check constructor details
    expect(screen.getByText(/Austrian/)).toBeDefined()
  })

  test('handles empty constructor list', async () => {
    // Mock empty API response
    const mockConstructors = {
      MRData: {
        ConstructorTable: {
          Constructors: [],
        },
      },
    }

    vi.mocked(f1Api.getConstructors).mockResolvedValueOnce(mockConstructors)

    renderWithProviders(<RouterProvider router={router} />)
    const constructorsLink = screen.getByRole('link', { name: 'Constructors' })
    fireEvent.click(constructorsLink)

    // Wait for loading to finish
    const title = await screen.findByText('F1 Constructors 2024')
    expect(title).toBeDefined()

    // Verify no constructors are rendered
    expect(screen.queryByText(/Red Bull Racing/)).toBeNull()
  })
})
