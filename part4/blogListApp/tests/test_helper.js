const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Blog = require('../models/blog')

const loginAndGetToken = async () => {
  const response = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'password' })
    .expect(200)
  return response.body.token
}

const userInit = async () => {
  await User.deleteMany({}) // Clear the database

  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({ username: 'testuser', passwordHash })
  await user.save()
}

const blogInit = async () => {
  const user = await User.findOne({ username: 'testuser' })

  const initialPosts = [
    {
      title: 'First Post',
      author: 'john',
      url: 'john@mail.com',
      likes: 1,
      user: user._id,
    },
    {
      title: 'Second Post',
      author: 'jane',
      url: 'jane@mail.com',
      likes: 2,
      user: user._id,
    },
  ]

  await Blog.deleteMany({})

  let blogObject = new Blog(initialPosts[0])
  await blogObject.save()

  blogObject = new Blog(initialPosts[1])
  await blogObject.save()
}

module.exports = { loginAndGetToken, userInit, blogInit }
