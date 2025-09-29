import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

// Define types
type ApiResponse = {
  message: string;
};

type CommentsResponse = {
  comments: Array<{
    id: number;
    text: string;
    timestamp: string;
    author: string;
  }>;
};

// Mock the fetch API
globalThis.fetch = vi.fn() as unknown as typeof fetch;

function mockFetchResponse(data: ApiResponse | CommentsResponse) {
  return {
    json: vi.fn().mockResolvedValue(data),
    ok: true,
  };
}

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation for multiple endpoints
    (globalThis.fetch as unknown as Mock).mockImplementation((url: string) => {
      if (url === '/api') {
        return Promise.resolve(
          mockFetchResponse({ message: 'Test Message from API' })
        );
      } else if (url === '/api/comments') {
        return Promise.resolve(mockFetchResponse({ comments: [] }));
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });
  });

  it('renders App component correctly', () => {
    render(<App />);
    expect(screen.getByText('Mentat Template JS')).toBeInTheDocument();
    expect(screen.getByText(/React, Vite, Vitest/)).toBeInTheDocument();
    expect(screen.getByText(/Node.js, Express, Jest/)).toBeInTheDocument();
    expect(
      screen.getByText(/TypeScript, ESLint, Prettier/)
    ).toBeInTheDocument();
  });

  it('loads and displays API message', async () => {
    render(<App />);

    // Should initially show loading message
    expect(screen.getByText(/Loading message from server/)).toBeInTheDocument();

    // Wait for the fetch to resolve and check if the message is displayed
    await waitFor(() => {
      expect(screen.getByText('Test Message from API')).toBeInTheDocument();
    });

    expect(globalThis.fetch).toHaveBeenCalledWith('/api');
  });

  it('handles API error', async () => {
    // Mock a failed API call for the main API endpoint
    (globalThis.fetch as unknown as Mock).mockImplementation((url: string) => {
      if (url === '/api') {
        return Promise.reject(new Error('API Error'));
      } else if (url === '/api/comments') {
        return Promise.resolve(mockFetchResponse({ comments: [] }));
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    render(<App />);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Error: API Error/)).toBeInTheDocument();
    });
  });

  it('renders comments section', async () => {
    render(<App />);

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Comments')).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Write a comment...')
    ).toBeInTheDocument();
    expect(
      screen.getByText('No comments yet. Be the first to comment!')
    ).toBeInTheDocument();
  });

  it('displays existing comments', async () => {
    const mockComments = [
      {
        id: 1,
        text: 'This is a test comment',
        author: 'Test User',
        timestamp: '2023-01-01T00:00:00.000Z',
      },
    ];

    (globalThis.fetch as unknown as Mock).mockImplementation((url: string) => {
      if (url === '/api') {
        return Promise.resolve(
          mockFetchResponse({ message: 'Test Message from API' })
        );
      } else if (url === '/api/comments') {
        return Promise.resolve(mockFetchResponse({ comments: mockComments }));
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    render(<App />);

    // Wait for comments to load
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    });
  });
});
