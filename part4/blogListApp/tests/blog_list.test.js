const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')

const initialPosts = [
  {
    title: 'First Post',
    author: 'john',
    url: 'john@mail.com',
    likes: 1,
  },
  {
    title: 'Second Post',
    author: 'jane',
    url: 'jane@mail.com',
    likes: 2,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(initialPosts[0])
  await blogObject.save()

  blogObject = new Blog(initialPosts[1])
  await blogObject.save()
})

test('posts are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialPosts.length)
})

test('the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach((blog) => {
    assert.ok(blog.id, 'id exists')
    assert.strictEqual(blog._id, undefined, '_id not exist')
  })
})

test('a valid blog can be posted ', async () => {
  const newPost = {
    title: 'a valid post test',
    author: 'frank',
    url: 'frank@mail.com',
    likes: 3,
  }

  await api
    .post('/api/blogs')
    .send(newPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const postsAtEnd = await Blog.find({})
  assert.strictEqual(postsAtEnd.length, initialPosts.length + 1)

  const titles = postsAtEnd.map((n) => n.title)
  assert(titles.includes('a valid post test'))
})

test('missing likes property will be default to 0 ', async () => {
  const newPost = {
    title: 'a post without likes',
    author: 'jack',
    url: 'jack@mail.com',
  }

  await api
    .post('/api/blogs')
    .send(newPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const postsAtEnd = await Blog.find({})
  assert.strictEqual(postsAtEnd.length, initialPosts.length + 1)

  assert.strictEqual(postsAtEnd[postsAtEnd.length - 1].likes, 0)
})

test('post without title can not be added', async () => {
  const newPost = {
    author: 'oz',
    url: 'oz@mail.com',
    likes: 5,
  }

  await api.post('/api/blogs').send(newPost).expect(400)

  const postsAtEnd = await Blog.find({})

  assert.strictEqual(postsAtEnd.length, initialPosts.length)
})

test('post without url can not be added', async () => {
  const newPost = {
    title: 'a post without url',
    author: 'oz',
    likes: 5,
  }

  await api.post('/api/blogs').send(newPost).expect(400)

  const postsAtEnd = await Blog.find({})

  assert.strictEqual(postsAtEnd.length, initialPosts.length)
})

test('deleting a note succeeds with status code 204 if id is valid', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToDelete = blogsAtStart[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

  const blogsAtEnd = await Blog.find({})

  assert.strictEqual(blogsAtEnd.length, initialPosts.length - 1)

  const blogs = blogsAtEnd.map((blog) => blog.title)
  assert(!blogs.includes(blogToDelete.title))
})

test('updating a note succeed with valid data ', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToUpdate = blogsAtStart[0]

  console.log(blogToUpdate)

  const updatedPost = {
    title: 'an updated post',
    author: 'john',
    url: 'john@mail.com',
    likes: 10,
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedPost)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  console.log('Updated post data:', updatedPost)

  const updatedBlog = await Blog.findById(blogToUpdate.id)
  assert.strictEqual(updatedBlog.title, updatedPost.title)
  assert.strictEqual(updatedBlog.likes, updatedPost.likes)
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})

    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
