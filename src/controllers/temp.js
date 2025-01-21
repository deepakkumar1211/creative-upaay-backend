import {asyncHandler} from "../utils/asyncHandler.js"
import{ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import { Todo } from "../models/todo.model.js"
import {Done} from "../models/done.model.js"
import {Progress} from "../models/progress.model.js"


// const createTodo = asyncHandler(async (req, res) => {
    
//     if (!req.body) {
//         throw new ApiError(400, "Request body is missing");
//     }

//     const { title, description, owner } = req.body;

//     // Check if all required fields are provided
//     if ([title, description, owner].some((field) => !field?.trim())) {
//         throw new ApiError(400, "All fields (title, description, owner) are required");
//     }

//     const newTodo = await Todo.create({
//         title,
//         description,
//         owner,
//     });

//     if (!newTodo) {
//         throw new ApiError(500, "Something went wrong while creating the todo");
//     }

//     // Return success response with created Todo details
//     return res.status(201).json(
//         new ApiResponse(200, newTodo, "Todo created successfully")
//     );
// });

// const createTodo = asyncHandler(async (req, res) => {
//     // Log request body for debugging purposes (can be removed later)
//     // console.log("Request Body:", req.body);

//     if (!req.body) {
//         throw new ApiError(400, "Request body is missing");
//     }

//     const { title, description, owner, status } = req.body;

//     // Check if all required fields are provided
//     if ([title, description, owner, status].some((field) => !field?.trim())) {
//         throw new ApiError(400, "All fields (title, description, owner, status) are required");
//     }

//     // Validate status value
//     if (!["Todo", "Done", "Progress"].includes(status)) {
//         throw new ApiError(400, "Invalid status value. It must be 'Todo', 'Done', or 'Progress'");
//     }

//     // Select the model based on the status value
//     let selectedModel;
//     if (status === "Todo") {
//         selectedModel = Todo;
//     } else if (status === "Done") {
//         selectedModel = Done;
//     } else if (status === "Progress") {
//         selectedModel = Progress;
//     }

//     // Create a new task in the selected collection (model)
//     const newTodo = await selectedModel.create({
//         title,
//         description,
//         owner,
//     });

//     if (!newTodo) {
//         throw new ApiError(500, `Something went wrong while creating the task in ${status} collection`);
//     }

//     // Return success response with created task details
//     return res.status(201).json(
//         new ApiResponse(200, newTodo, `${status} task created successfully`)
//     );
// });

const createTodo = asyncHandler(async (req, res) => {
    if (!req.body) {
        throw new ApiError(400, "Request body is missing");
    }

    const { title, description, owner, status, taskId } = req.body;

    // Check if all required fields are provided
    if ([title, description, owner, status, taskId].some((field) => !field?.trim())) {
        throw new ApiError(400, "All fields (title, description, owner, status, taskId) are required");
    }

    // Validate status value
    if (!["Todo", "Done", "Progress"].includes(status)) {
        throw new ApiError(400, "Invalid status value. It must be 'Todo', 'Done', or 'Progress'");
    }

    // Select the model based on the status value
    let selectedModel;
    let prevModel;

    if (status === "Todo") {
        selectedModel = Todo;
        prevModel = null; // No previous collection for "Todo"
    } else if (status === "Done") {
        selectedModel = Done;
        prevModel = Progress; // Moving task from Progress to Done
    } else if (status === "Progress") {
        selectedModel = Progress;
        prevModel = Todo; // Moving task from Todo to Progress
    }

    // If there's a previous model (i.e., for Progress and Done), remove task from it
    if (prevModel) {
        const taskInPrevModel = await prevModel.findById(taskId);
        if (!taskInPrevModel) {
            throw new ApiError(404, `Task not found in ${prevModel.modelName} collection`);
        }
        await prevModel.findByIdAndDelete(taskId);
    }

    // Create a new task in the selected collection (model)
    const newTask = await selectedModel.create({
        title,
        description,
        owner,
    });

    if (!newTask) {
        throw new ApiError(500, `Something went wrong while creating the task in ${status} collection`);
    }

    // Return success response with created task details
    return res.status(201).json(
        new ApiResponse(200, newTask, `${status} task created successfully`)
    );
});

export { moveTask };


export {
    createTodo
}