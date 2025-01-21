import mongoose, {Schema} from "mongoose";

const TodoSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    }, 
    {timestamps: true}
)


export const Todo =  mongoose.model("Todo", TodoSchema)
