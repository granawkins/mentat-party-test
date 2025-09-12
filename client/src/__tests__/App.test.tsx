import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Define types
type MessagesResponse = {
  messages: Array<{
    id: string;
    username: string;
    text: string;
    timestamp: string;
  }>;
};

// Mock the fetch API
globalThis.fetch = vi.fn() as unknown as typeof fetch;

function mockMessagesResponse(messages: MessagesResponse['messages'] = []) {
  return {
    json: vi.fn().mockResolvedValue({ messages }),
    ok: true,
  };
}

function mockPostResponse(message: MessagesResponse['messages'][0]) {
  return {
    json: vi.fn().mockResolvedValue({ message }),
    ok: true,
  };
}

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation for messages endpoint
    (globalThis.fetch as unknown as Mock).mockImplementation((url: string) => {
      if (url === '/api/messages') {
        return Promise.resolve(
          mockMessagesResponse([
            {
              id: '1',
              username: 'Mentat',
              text: 'Welcome to Mentat Party! 🎉 Let the conversation begin!',
              timestamp: new Date().toISOString(),
            },
          ])
        );
      }
      return Promise.resolve(mockMessagesResponse());
    });
  });

  it('renders username input screen initially', () => {
    render(<App />);
    expect(screen.getByText('🎉 Mentat Party')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Welcome to the party! Enter your username to join the chat./
      )
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter your username...')
    ).toBeInTheDocument();
    expect(screen.getByText('Join the Party! 🚀')).toBeInTheDocument();
  });

  it('allows user to set username and enter chat', async () => {
    const user = userEvent.setup();
    render(<App />);

    const usernameInput = screen.getByPlaceholderText('Enter your username...');
    const joinButton = screen.getByText('Join the Party! 🚀');

    await user.type(usernameInput, 'TestUser');
    await user.click(joinButton);

    // Should now show the chat interface
    await waitFor(() => {
      expect(screen.getByText(/Welcome, TestUser!/)).toBeInTheDocument();
    });
  });

  it('fetches and displays messages after entering chat', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Enter username
    const usernameInput = screen.getByPlaceholderText('Enter your username...');
    await user.type(usernameInput, 'TestUser');
    await user.click(screen.getByText('Join the Party! 🚀'));

    // Wait for messages to load
    await waitFor(() => {
      expect(
        screen.getByText(
          /Welcome to Mentat Party! 🎉 Let the conversation begin!/
        )
      ).toBeInTheDocument();
    });

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/messages');
  });

  it('allows user to send messages', async () => {
    const user = userEvent.setup();

    // Mock POST request
    (globalThis.fetch as unknown as Mock).mockImplementation(
      (url: string, options?: RequestInit) => {
        if (url === '/api/messages' && options?.method === 'POST') {
          return Promise.resolve(
            mockPostResponse({
              id: '2',
              username: 'TestUser',
              text: 'Hello everyone!',
              timestamp: new Date().toISOString(),
            })
          );
        }
        if (url === '/api/messages') {
          return Promise.resolve(
            mockMessagesResponse([
              {
                id: '1',
                username: 'Mentat',
                text: 'Welcome to Mentat Party! 🎉 Let the conversation begin!',
                timestamp: new Date().toISOString(),
              },
            ])
          );
        }
        return Promise.resolve(mockMessagesResponse());
      }
    );

    render(<App />);

    // Enter username
    const usernameInput = screen.getByPlaceholderText('Enter your username...');
    await user.type(usernameInput, 'TestUser');
    await user.click(screen.getByText('Join the Party! 🚀'));

    // Wait for chat interface to load
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Type your message...')
      ).toBeInTheDocument();
    });

    // Type and send a message
    const messageInput = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByText('Send 🚀');

    await user.type(messageInput, 'Hello everyone!');
    await user.click(sendButton);

    // Verify POST request was made
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'TestUser',
        text: 'Hello everyone!',
      }),
    });
  });

  it('handles fetch errors gracefully', async () => {
    // Mock a failed API call
    (globalThis.fetch as unknown as Mock).mockRejectedValue(
      new Error('Network Error')
    );

    render(<App />);

    // Enter username to trigger message fetching
    const usernameInput = screen.getByPlaceholderText('Enter your username...');
    await userEvent.setup().type(usernameInput, 'TestUser');
    await userEvent.setup().click(screen.getByText('Join the Party! 🚀'));

    // Should still show the chat interface even if messages fail to load
    await waitFor(() => {
      expect(
        screen.getByText(/No messages yet. Be the first to say something!/)
      ).toBeInTheDocument();
    });
  });
});
