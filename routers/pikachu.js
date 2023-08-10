const router = require("express").Router();
const { pikachu } = require("../controllers/index");

router.get("/getAll", pikachu.getAll);
router.get("/getBy/:name", pikachu.getBy);
router.post("/catch", pikachu.catch);
router.get("/getMy", pikachu.getMy);
router.get("/isPrime", pikachu.prime);

module.exports = router;
