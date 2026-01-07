const express = require("express");
const path = require("path");

const router = express.Router();

router.use(
  "/",
  express.static(path.join(__dirname, "../../uploads/videos/frieren"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "Range");
      res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    },
  })
);

module.exports = router;
