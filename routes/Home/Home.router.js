const express = require("express");
const router = express.Router();
const { landingHome } = require("../../controllers/Home/Home.controller");

router.get("/", landingHome);

module.exports = router;
