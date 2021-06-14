const utils = {
  insertUniqueId: (userArr = [], newData) => {
    if (
      !newData ||
      userArr.findIndex((data) => data.toString() === newData.toString()) !== -1
    ) {
      return userArr
    }
    return [newData, ...userArr]
  },

  insertUniqueIds: (userArr = [], newArr = []) => {
    let newUniqueData = []
    if (!newArr?.length) {
      newUniqueData = new Set([...userArr])
      return [...newUniqueData]
    }
    if (userArr.length !== 0)
      newUniqueData = new Set([
        ...newArr,
        ...userArr.map((id) => id.toString())
      ])
    else newUniqueData = new Set([...newArr])

    return [...newUniqueData]
  },
  addOrRemoveFavoriteTutors: (tutorArr = [], newIdTutor = undefined) => {
    if (!newIdTutor) return tutorArr
    const filteredTutors = tutorArr.filter(
      (tutorId) => tutorId.toString() !== newIdTutor.toString()
    )
    return filteredTutors.length === tutorArr.length
      ? [...tutorArr, newIdTutor]
      : filteredTutors
  },
  insertOrRemove: (data = [], newData = undefined) => {
    if (!newData) return skills
    const regexNewData = new RegExp(newData.join('|'), 'i')
    const filterData = data.filter(
      (d) => !d.toString().toLowerCase().match(regexNewData)
    )
    if (filterData.length === data.length) return [...data, ...newData]
    return filterData
  },
  areValidUpdate: (user) => {
    if (
      !user.languages.length ||
      !user.availability.length ||
      !user.subjectsId.length ||
      !user.coursesId.length
    )
      return false
    return true
  }
}

module.exports = utils
