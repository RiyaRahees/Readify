const express = require("express");
const router = express.Router();
const {
     getDashboard, 
     getSalesChart,
     getWeeklyReport
 } = require("../controller/dashboardController");

router.get("/", getDashboard);
router.get("/sales-chart", getSalesChart);
router.get("/weekly-report", getWeeklyReport);

module.exports = router;