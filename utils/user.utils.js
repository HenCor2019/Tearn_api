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
  insertOrRemoveSkills: (skills = [], newSkills = undefined) => {
    if (!newSkills) return skills
    const regexNewSkills = new RegExp(newSkills.join(''), 'i')
    const filterSkills = skills.filter(
      (skill) => !skill.toLowerCase().match(regexNewSkills)
    )
    if (filterSkills.length === skills.length) return [...skills, ...newSkills]
    return filterSkills
  }
}

module.exports = utils
