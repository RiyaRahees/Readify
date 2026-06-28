const express = require("express");
const router = express.Router();

const {
    getAllCustomers,
    toggleBlockUser
} = require("../controller/customerController");

router.get("/", getAllCustomers);
router.patch("/block/:id",toggleBlockUser);

module.exports = router;