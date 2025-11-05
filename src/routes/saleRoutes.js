import express from "express"
import { getSales, getSale, createSale, updateSaleStatus, getSalesStatistics } from "../controllers/saleController.js"
import { protect, authorize } from "../middlewares/auth.js"

const router = express.Router()

router.use(protect)

router.get("/statistics", authorize("admin", "employee"), getSalesStatistics)
router.get("/", getSales)
router.get("/:id", getSale)
router.post("/", authorize("admin", "employee"), createSale)
router.patch("/:id/status", authorize("admin", "employee"), updateSaleStatus)

export default router
