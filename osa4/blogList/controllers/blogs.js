const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body
  if (body.title && body.url) {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
    })

    const res = await blog.save()
    response.status(201).json(res)
  } else {
    response.status(400).end()
  }
})

blogRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

blogRouter.put('/:id', async (req, res) => {
  const { title, author, url, likes } = req.body

  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    return res.status(404).end()
  }

  if (!title || !url) {
    return res.status(400).end()
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes ?? blog.likes

  const updatedBlog = await blog.save()

  res.status(200).json(updatedBlog)
})


module.exports = blogRouter
