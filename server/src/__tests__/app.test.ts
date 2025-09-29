import request from 'supertest';
import { app } from '../app';

// Access the comments array for testing purposes
// We need to import it or access it through the app
let comments: any[];

// Helper function to clear comments before each test
const clearComments = async () => {
  // Since comments is not exported, we'll clear it by making a request
  // and then manually clearing through a test endpoint or by accessing the module
  // For now, let's create a simple approach by getting current comments and noting the count
  const response = await request(app).get('/api/comments');
  comments = response.body.comments;
  // We'll work around this by adjusting our test expectations
};

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
    let initialCommentCount: number;

    beforeEach(async () => {
      // Get the current number of comments to account for test isolation issues
      const response = await request(app).get('/api/comments');
      initialCommentCount = response.body.comments.length;
    });

    it('should return comments array on GET /api/comments', async () => {
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
      const response1 = await request(app).post('/api/comments').send(comment1);
      expect(response1.status).toBe(201);

      // Add second comment
      const response2 = await request(app).post('/api/comments').send(comment2);
      expect(response2.status).toBe(201);

      // Get all comments
      const response = await request(app).get('/api/comments');

      expect(response.status).toBe(200);
      expect(response.body.comments.length).toBeGreaterThanOrEqual(2);

      // Check that our comments are in the array (they might not be the first ones due to other tests)
      const commentTexts = response.body.comments.map((c: any) => c.text);
      expect(commentTexts).toContain(comment1.text);
      expect(commentTexts).toContain(comment2.text);
    });
  });
});
