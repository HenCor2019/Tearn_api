const Subject = require('../models/Subject.model')
const mongoose = require('mongoose')
const { server } = require('../bin/www')
const { initialSubjects, api, getAllResults } = require('./helper')

const subjectPath = 'subject'

beforeAll(async () => {
  await Subject.deleteMany()

  for (subject of initialSubjects) {
    const newSubject = new Subject(subject)
    newSubject.url = `${process.env.BASE_URL}${newSubject._id}`
    await newSubject.save()
  }
})

test('Subjects as returnedt as a JSON', async () => {
  await api
    .get(`/api/v1/${subjectPath}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('Exist two subjects', async () => {
  const results = await getAllResults(subjectPath)
  expect(results).toHaveLength(initialSubjects.length)
})

test('Create a valid subject', async () => {
  const newSubject = {
    name: 'Sociología empresarial',
    categoryId: '60aff7574c0d1712b07ca444'
  }

  await api
    .post(`/api/v1/${subjectPath}`)
    .send(newSubject)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const results = await getAllResults(subjectPath)
  expect(results).toHaveLength(initialSubjects.length + 1)
})

afterAll(async () => {
  mongoose.connection.close()
  server.close()
})
