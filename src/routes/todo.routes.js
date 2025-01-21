import { Router } from "express";
import { createTodo, moveTask } from "../controllers/todo.controller.js";

const router = Router()

router.route("/create-todo").post(createTodo)

router.route("/move-task").post(moveTask)

export default router