const mongoose = require('mongoose')
const { server } = require('../bin/www')
const Course = require('../models/Course.model')
const { api, initialCourses, getAllResults } = require('./helper')
const coursePath = 'course'

beforeAll(async () => {
  await Course.deleteMany({})

  for (course of initialCourses) {
    const newCourse = new Course(course)
    newCourse.url += `course/${newCourse._id}`
    newCourse.save()
  }
})

test('Response with a application/json', async () => {
  await api
    .get(`/api/v1/${coursePath}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('Exist two courses', async () => {
  const results = await getAllResults(coursePath)
  expect(results).toHaveLength(initialCourses.length)
})

test('Creating a vaid course', async () => {
  const newCourse = {
    name: 'Sociología IX',
    subjectId: '60affcb0b81c27153436eeb6',
    imgUrl: `${process.env.BASE_URL}Theatre.png`
  }

  await api
    .post(`/api/v1/${coursePath}`)
    .send(newCourse)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const results = await getAllResults(coursePath)
  expect(results).toHaveLength(initialCourses.length + 1)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
