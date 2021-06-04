const Category = require('../models/Category.model')
const mongoose = require('mongoose')
const { server } = require('../bin/www')

const { initialCategories, api, getAllResults } = require('./helper')
const categoryPath = 'category'

beforeAll(async () => {
  await Category.deleteMany({})

  for (category of initialCategories) {
    const newCategory = new Category(category)
    newCategory.url = `${process.env.BASE_URL}${newCategory._id}`
    await newCategory.save()
  }
})

test('Categories as returnedt as a JSON', async () => {
  await api
    .get(`/api/v1/${categoryPath}/`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('Exist two categories', async () => {
  const results = await getAllResults(categoryPath)
  expect(results).toHaveLength(initialCategories.length)
})

test('Create a valid category', async () => {
  const newCategory = {
    name: 'Contaduria',
    description: 'Razonar es una de las virtudes del ser humano',
    imgUrl: `${process.env.ROOT_URL}Library.png`
  }

  await api
    .post(`/api/v1/${categoryPath}/`)
    .send(newCategory)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const results = await getAllResults(categoryPath)
  expect(results).toHaveLength(initialCategories.length + 1)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
