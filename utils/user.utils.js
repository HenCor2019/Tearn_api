const utils = {
  insertUniqueId: (userArr = [], newData) => {
    if (!newData || userArr.findIndex((data) => data === newData) !== -1) { return userArr }
    return [newData, ...userArr]
  },

  insertUniqueIds: (userArr = [], newArr) => {
    let newUniqueData = []

    if (!newArr) {
      newUniqueData = new Set([...userArr])
      return [...newUniqueData]
    }
    if (userArr.length !== 0) newUniqueData = new Set([...newArr, userArr])
    else newUniqueData = new Set([...newArr])

    return [...newUniqueData]
  },
  addOrRemoveFavoriteTutors: (tutorArr = [], newIdTutor = undefined) => {
    if (!newIdTutor) return tutorArr
    const filteredTutors = tutorArr.filter((tutorId) => tutorId !== newIdTutor)
    return filteredTutors.length === tutorArr.length
      ? [...tutorArr, newIdTutor]
      : filteredTutors
  }
}

module.exports = utils
