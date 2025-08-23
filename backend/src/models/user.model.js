// import mongoose, {Schema} from "mongoose";

// const userSchema = new Schema(
//     {
//         name: {type: String, require: true},
//         username: {type: String, require: true, unique:true},
//         password : {type:String, require:true},
//         token: {type: String}
//     }
// )

// const User = mongoose.model("User", userSchema);

// export{User};





import mongoose, { Schema } from "mongoose";

const userScheme = new Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        token: { type: String }
    }
)

const User = mongoose.model("User", userScheme);

export { User };