const router = require("express").Router();
const { userSeq } = require("../controllers/index");

router.post("/register", userSeq.register);
router.post("/login", userSeq.login);
router.get("/getAll", userSeq.findAllUser);
router.get("/getById/:id", userSeq.findById);
router.put("/update/:id", userSeq.update);
router.delete("/remove/:id", userSeq.remove);

module.exports = router;
