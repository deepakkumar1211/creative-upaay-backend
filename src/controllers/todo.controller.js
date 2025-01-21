import {asyncHandler} from "../utils/asyncHandler.js"
import{ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import { Todo } from "../models/todo.model.js"
import { Progress } from "../models/progress.model.js"
import { Done } from "../models/done.model.js"


const createTodo = asyncHandler(async (req, res) => {
    
    if (!req.body) {
        throw new ApiError(400, "Request body is missing");
    }

    const { title, description, owner } = req.body;

    // Check if all required fields are provided
    if ([title, description, owner].some((field) => !field?.trim())) {
        throw new ApiError(400, "All fields (title, description, owner) are required");
    }

    const newTodo = await Todo.create({
        title,
        description,
        owner,
    });

    if (!newTodo) {
        throw new ApiError(500, "Something went wrong while creating the todo");
    }

    // Return success response with created Todo details
    return res.status(201).json(
        new ApiResponse(200, newTodo, "Todo created successfully")
    );
});


const moveTask = asyncHandler(async (req, res) => {
    try {
        if (!req.body) {
            throw new ApiError(400, "Request body is missing");
        }

        const { taskId, status } = req.body;

        if (!taskId || !status) {
            throw new ApiError(400, "TaskId and status are required");
        }

        if (!["Progress", "Done"].includes(status)) {
            throw new ApiError(400, "Invalid status value. It must be 'Progress' or 'Done'");
        }

        // Variables for current collection (previous status) and new collection (next status)
        let currentCollection;
        let nextCollection;

        // Determine current collection based on the previous status
        if (status === "Progress") {
            currentCollection = Todo;  // Tasks should be moved from "Todo" to "Progress"
            nextCollection = Progress;
        } else if (status === "Done") {
            currentCollection = Progress;  // Tasks should be moved from "Progress" to "Done"
            nextCollection = Done;
        }

        // Find the task in the current collection
        const taskInCurrentCollection = await currentCollection.findById(taskId);
        if (!taskInCurrentCollection) {
            throw new ApiError(404, `Task not found in ${currentCollection.modelName} collection`);
        }

        // Delete the task from the current collection
        await currentCollection.findByIdAndDelete(taskId);

        // Move the task to the next collection (Progress or Done)
        const movedTask = await nextCollection.create({
            title: taskInCurrentCollection.title,
            description: taskInCurrentCollection.description,
            owner: taskInCurrentCollection.owner,
            status,
        });

        if (!movedTask) {
            throw new ApiError(500, `Something went wrong while moving the task to ${status} collection`);
        }

        // Return success response with moved task details
        return res.status(200).json(
            new ApiResponse(200, movedTask, `Task moved to ${status} collection successfully`)
        );
    } catch (error) {
        console.error("Error in moveTask:", error);  // Log error for debugging purposes

        // If error is an instance of ApiError, send it as a response
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        }

        // Handle any unexpected errors
        return res.status(500).json(new ApiResponse(500, null, "An unexpected error occurred"));
    }
});


export {
    createTodo,
    moveTask
}