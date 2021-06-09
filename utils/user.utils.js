const utils = {
  insertUniqueId: (userArr = [], newData) => {
    if (!newData || userArr.findIndex((data) => data.toString() === newData.toString()) !== -1) {
      return userArr
    }
    return [newData, ...userArr]
  },

  insertUniqueIds: (userArr = [], newArr = []) => {
    let newUniqueData = []
    if (!newArr?.length) {
      console.log({ userArr, newArr })
      newUniqueData = new Set([...userArr])
      return [...newUniqueData]
    }
    if (userArr.length !== 0)
      newUniqueData = new Set([
        ...newArr,
        ...userArr.map((id) => id.toString())
      ])
    else newUniqueData = new Set([...newArr])

    console.log({ newUniqueData })

    return [...newUniqueData]
  },
  addOrRemoveFavoriteTutors: (tutorArr = [], newIdTutor = undefined) => {
    if (!newIdTutor) return tutorArr
    const filteredTutors = tutorArr.filter((tutorId) => tutorId !== newIdTutor)
    return filteredTutors.length === tutorArr.length
      ? [...tutorArr, newIdTutor]
      : filteredTutors
  },
  insertValidAvailability: (
    availabilities = [],
    newAvailabilites = undefined
  ) => {
    const AVAILABILITIES = ["VIRTUAL", "PRESENCIAL"]
    if (
      !newAvailabilites ||
      !newAvailabilites.filter((availability) => availability != 0).length ||
      !newAvailabilites.length
    )
      return !availabilities.length ? [AVAILABILITIES[0]] : availabilities
    return [
      newAvailabilites[0] == 1 ? AVAILABILITIES[0] : "",
      newAvailabilites[1] == 1 ? AVAILABILITIES[1] : ""
    ].filter((aval) => aval != "")
  }
}

module.exports = utils
