import mongoose, {Schema} from "mongoose";

const progressSchema = new Schema(
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


export const Progress =  mongoose.model("Progress", progressSchema)
