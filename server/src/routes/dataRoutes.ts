import { Router } from "express";
import {
  getAllData,
  getDataById,
  deleteData,
} from "../controllers/dataController";

const router = Router();

// Routes for electric cars data
router.get("/", getAllData);       // Get all electric cars (with optional filters)
router.get("/:id", getDataById);  // Get a single car by ID
router.delete("/:id", deleteData);// Delete a car by ID

export default router;
