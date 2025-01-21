import mongoose, {Schema} from "mongoose";

const DoneSchema = new Schema(
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


export const Done =  mongoose.model("Done", DoneSchema)
