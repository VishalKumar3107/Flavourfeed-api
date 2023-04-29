import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username:{type:String, requierd:true, unique:true},
    password:{type:String, requierd:true},
    savedRecipes:[{type:mongoose.Schema.Types.ObjectId, ref: "recipes"}]
})

export const UserModel = mongoose.model("users", UserSchema);