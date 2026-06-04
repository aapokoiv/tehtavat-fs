const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const res = await api.get('/api/blogs')

  assert.strictEqual(res.body.length, helper.initialBlogs.length)
})

test('blog identifier is "id"', async () => {
  const blogs = await helper.blogsInDB()

  assert('id' in blogs[0])
  assert.strictEqual('_id' in blogs[0], false)
})

test('blog post increases total blogs', async () => {
  const newBlog = {
    "title": "first",
    "author": "me",
    "url": "www.me.first",
    "likes": 420
  }

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await helper.blogsInDB()
  assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)

  const addedBlog = blogs[blogs.length - 1]
  assert.deepStrictEqual(
    {
      title: addedBlog.title,
      author: addedBlog.author,
      url: addedBlog.url,
      likes: addedBlog.likes
    },
    newBlog
  )
})

test('undefined likes default to zero', async () => {
  const newBlog = {
    "title": "First",
    "author": "Me",
    "url": "www.me.first"
  }

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await helper.blogsInDB()

  const addedBlog = blogs[blogs.length - 1]
  assert.deepStrictEqual(
    {
      title: addedBlog.title,
      author: addedBlog.author,
      url: addedBlog.url,
      likes: addedBlog.likes
    },
    {
      "title": "First",
      "author": "Me",
      "url": "www.me.first",
      "likes": 0
    }
  )
})

test('post with a title missing returns 400', async () => {
  const newBlog = {
    "author": "me",
    "url": "www.me.first",
    "likes": 420
  }

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('post with a missing url returns 400', async () => {
  const newBlog = {
    "title": "First",
    "author": "me",
    "likes": 420
  }

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('delete with valid id works', async () => {
  const startBlogs = await helper.blogsInDB()
  
  await api.delete(`/api/blogs/${startBlogs[0].id}`).expect(204)

  const endBlogs = await helper.blogsInDB()

  const ids = endBlogs.map(n => n.id)
  assert(!ids.includes(startBlogs[0].id))

  assert.strictEqual(startBlogs.length - 1, endBlogs.length)
})

test('delete with invalid id returns 404', async () => {
  await api.delete(`/api/notes/notexistingid`).expect(404)
})

test('valid update works', async () => {
  const startBlogs = await helper.blogsInDB()
  
  const newInfo = {
      "title": "First",
      "author": "Me",
      "url": "www.me.first",
      "likes": 1
    }

  await api
    .put(`/api/blogs/${startBlogs[0].id}`)
    .send(newInfo)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const endBlogs = await helper.blogsInDB()
  assert(endBlogs[0].likes, newInfo.likes)
})

test('invalid update id returns 404', async () => {
  const newInfo = {
      "title": "First",
      "author": "Me",
      "url": "www.me.first",
      "likes": 1
    }

  await api
    .put(`/api/blogs/665f1f2c0c7a2a1234567890`)
    .send(newInfo)
    .expect(404)
})

test('invalid parameters returns 400', async () => {
  const startBlogs = await helper.blogsInDB()
  const newInfo = {
      "title": "First",
      "author": "Me",
      "likes": 1
    }

  await api
    .put(`/api/blogs/${startBlogs[0].id}`)
    .send(newInfo)
    .expect(400)
})

after(async () => {
  await mongoose.connection.close()
})
