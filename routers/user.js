const router = require("express").Router();
const { user } = require("../controllers/index");

router.post("/register", user.register);
router.get("/getAll", user.getAll);
router.get("/getBy/:username", user.getBy);
router.put("/update/:username", user.update);
router.delete("/remove/:username", user.delete);

module.exports = router;
