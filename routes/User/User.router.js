const express = require("express");
const {
  loginFacebook,
  allUser,
  updateToTutor,
  updateNormalUser,
  oneTutor,
  allTutors,
  deleteUser,
  deleteAll,
  oneUser,
  tutorsUser,
} = require("../../controllers/User/User.controller");
const router = express.Router();

router.post("/login", loginFacebook);

router.get("/", allUser);
router.get("/:id", oneUser);
router.get("/tutor/", allTutors);
router.get("/tutor/:id", oneTutor);
router.get("/tutors/:id", tutorsUser);

router.put("/update-tutor/", updateToTutor);
router.put("/update", updateNormalUser);

router.delete("/:id", deleteUser);
router.delete("/", deleteAll);

module.exports = router;
