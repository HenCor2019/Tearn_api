const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const initialCategories = [
  {
    name: 'Profesorado ',
    description: 'Razonar es una de las virtudes del ser humano',
    imgUrl: `${process.env.ROOT_URL}Library.png`
  },
  {
    name: 'Ingenieria',
    description: 'Razonar es una de las virtudes del ser humano',
    imgUrl: `${process.env.ROOT_URL}Library.png`
  }
]

const getAllResults = async (path = '') => {
  const response = await api.get(`/api/v1/${path}`)
  return response.body.results
}

const getIdCategory = async () => {
  const response = await api.get('/api/v1/category')

  return response.body.results[0]._id
}

const initialSubjects = [
  {
    name: 'Sociología',
    categoryId: '60aff7574c0d1712b07ca444'
  },
  {
    name: 'Lectura analitica',
    categoryId: '60aff7574c0d1712b07ca444'
  }
]
const initialCourses = [
  {
    name: 'Sociología VII',
    subjectId: '60affcb0b81c27153436eeb6',
    tutors: [],
    imgUrl: `${process.env.BASE_URL}Theatre.png`
  },
  {
    name: 'Sociología X',
    subjectId: '60affcb0b81c27153436eeb6',
    tutors: [],
    imgUrl: `${process.env.BASE_URL}Theatre.png`
  }
]

module.exports = {
  api,
  initialSubjects,
  initialCategories,
  initialCourses,
  getAllResults,
  getIdCategory
}
