import express from "express";
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();


//get-recipe
router.get("/", async (req, res) => {
  try {
    const result = await RecipeModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});


//create-recipe
router.post("/", verifyToken, async(req, res)=>{
    const recipe = new RecipeModel(req.body);
    try {
        const response = await recipe.save();
        res.json(response);
    } catch (err) {
        res.json(err);
    }
});



//save-recipe
router.put("/", verifyToken, async(req, res)=>{
    try {
        const recipe = await RecipeModel.findById(req.body.recipeID);
        const user = await UserModel.findById(req.body.userID);
        user.savedRecipes.push(recipe);
        await user.save();
        res.json({savedRecipes:user.savedRecipes});
    } catch (err) {
        res.json(err);
    }
});


//saved recipes routes
router.get("/savedRecipes/ids/:userID",async(req,res)=>{
    try {
        const user = await UserModel.findById(req.params.userID);
        res.json({savedRecipes:user?.savedRecipes});
    } catch (err) {
        res.json(err);
    }
});


router.get("/savedRecipes/:userID",async(req,res)=>{
    try {
        const user = await UserModel.findById(req.params.userID);
        const savedRecipes = await RecipeModel.find({
            _id: {$in: user.savedRecipes},
        });
        res.json({savedRecipes});
    } catch (err) {
        res.json(err);
    }
});

//recipe-particular
router.get("/:id", async (req, res) => {
    try {
      let recipeId = req.params.id
      const result = await RecipeModel.findById(recipeId).populate('userOwner');
      const username = result.userOwner.username;
      delete result.userOwner.username;
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

 // search-recipe
router.get("/search/:recipeName", async (req, res) => {
    try {
      const recipeName = req.params.recipeName;
      const result = await RecipeModel.findOne({
        name: { $regex: recipeName, $options: "i" },
      });
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Recipe not found" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

  //filter by cuisines
  router.get("/cuisines/:cuisine", async (req, res) => {
    try {
      const cuisine = req.params.cuisine.toLowerCase();
      const recipes = await RecipeModel.find({ cuisines: cuisine });
      res.status(200).json(recipes);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  
  //update a recipe
  router.put("/:id", verifyToken, async (req, res) => {
    try {
      const id = req.params.id;
      const recipe = await RecipeModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(recipe);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //delete a recipe
  router.delete("/:id", verifyToken, async (req, res) => {
    try {
      const id = req.params.id;
      const recipe = await RecipeModel.findByIdAndDelete(id);
      res.status(200).json(recipe);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

export { router as recipesRouter };