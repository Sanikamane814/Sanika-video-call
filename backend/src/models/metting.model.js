import mongoose , {mongo, Schema } from "mongoose";


const mettingSchema = new Schema ({
    user_id: {type:String},
    mettingCode:{type:String, require:true},
    date:{ type: Date, Default:Date.now, require:true}
})

const Metting = mongoose.model("Meeting", mettingSchema);

export {Metting};