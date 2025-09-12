import request from 'supertest';
import { app } from '../app';

describe('API Endpoints', () => {
  it('should return welcome message on GET /api', async () => {
    const response = await request(app).get('/api');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Welcome to the Mentat Party API! 🎉');
  });

  it('should serve the React app on GET /', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.header['content-type']).toContain('text/html');
  });

  it('should return messages on GET /api/messages', async () => {
    const response = await request(app).get('/api/messages');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('messages');
    expect(Array.isArray(response.body.messages)).toBe(true);
    expect(response.body.messages.length).toBeGreaterThan(0);
    expect(response.body.messages[0]).toHaveProperty('username', 'Mentat');
  });

  it('should create a new message on POST /api/messages', async () => {
    const newMessage = {
      username: 'TestUser',
      text: 'Hello, this is a test message!',
    };

    const response = await request(app).post('/api/messages').send(newMessage);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toHaveProperty('username', 'TestUser');
    expect(response.body.message).toHaveProperty(
      'text',
      'Hello, this is a test message!'
    );
    expect(response.body.message).toHaveProperty('id');
    expect(response.body.message).toHaveProperty('timestamp');
  });

  it('should return error for invalid message on POST /api/messages', async () => {
    const invalidMessage = {
      username: '',
      text: '',
    };

    const response = await request(app)
      .post('/api/messages')
      .send(invalidMessage);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
