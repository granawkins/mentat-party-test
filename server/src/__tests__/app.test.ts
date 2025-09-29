import request from 'supertest';
import { app } from '../app';

describe('API Endpoints', () => {
  it('should return welcome message on GET /api', async () => {
    const response = await request(app).get('/api');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Welcome to the Mentat API!');
  });

  it('should serve the React app on GET /', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.header['content-type']).toContain('text/html');
  });

  describe('Comments API', () => {
    it('should return empty comments array initially on GET /api/comments', async () => {
      const response = await request(app).get('/api/comments');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('comments');
      expect(Array.isArray(response.body.comments)).toBe(true);
    });

    it('should create a new comment on POST /api/comments', async () => {
      const newComment = {
        text: 'This is a test comment',
        author: 'Test User',
      };

      const response = await request(app)
        .post('/api/comments')
        .send(newComment);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('comment');
      expect(response.body.comment).toHaveProperty('id');
      expect(response.body.comment).toHaveProperty('timestamp');
      expect(response.body.comment.text).toBe(newComment.text);
      expect(response.body.comment.author).toBe(newComment.author);
    });

    it('should return 400 when text is missing on POST /api/comments', async () => {
      const invalidComment = {
        author: 'Test User',
      };

      const response = await request(app)
        .post('/api/comments')
        .send(invalidComment);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Text and author are required');
    });

    it('should return 400 when author is missing on POST /api/comments', async () => {
      const invalidComment = {
        text: 'This is a test comment',
      };

      const response = await request(app)
        .post('/api/comments')
        .send(invalidComment);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Text and author are required');
    });

    it('should persist comments across requests', async () => {
      const comment1 = {
        text: 'First comment',
        author: 'User 1',
      };

      const comment2 = {
        text: 'Second comment',
        author: 'User 2',
      };

      // Add first comment
      await request(app).post('/api/comments').send(comment1);

      // Add second comment
      await request(app).post('/api/comments').send(comment2);

      // Get all comments
      const response = await request(app).get('/api/comments');

      expect(response.status).toBe(200);
      expect(response.body.comments).toHaveLength(2);
      expect(response.body.comments[0].text).toBe(comment1.text);
      expect(response.body.comments[1].text).toBe(comment2.text);
    });
  });
});
