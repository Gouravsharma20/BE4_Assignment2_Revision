const express= require("express")
const Recipe = require("./model/recipeModel.js")
const {initializeDatabase} = require("./db/db.connection.js")

const app = express()

initializeDatabase()

app.use(express.json())

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));


app.get("/",(req,res)=>{
    res.json("welcome to cuisine express app")
})

// add new recipe

async function addRecipe(recipeToAdd) {
    try {
        const newRecipe = Recipe.insertOne(recipeToAdd)
        return newRecipe

    } catch(err){
        console.log("unable to ad new recipe")
    }
}

app.post("/recipes",async (req,res)=>{
     try {
        const addedRecipe = await addRecipe(req.body)
        if (!addRecipe) {
            return res.status(404).json({error:"newly added recipe not found"})
        } else {
            return res.status(200).json({message:"new Recipe added successfully",newlyAddedRecipe:addedRecipe})
        }

     } catch(err) {
        res.status(500).json({error:"an error occured while adding recipy",errorDetails:err.message})
     }
})

// get all recipes

async function getAllRecipe() {
    try {
         const getAllRecipe = await Recipe.find()
         return getAllRecipe
    } catch(err) {
        console.log("an error occured while getting all recipes")
        throw err
    }
}



app.get("/recipes",async(req,res)=>{
    try {
        const allRecipe = await getAllRecipe()
        if (!allRecipe) {
            return res.status(404).json({error:"all recipe not found"})
        } else {
            return res.status(200).json({message:"all recipies found successfully",allRecipes:allRecipe})
        }
    } catch(err) {
        return res.status(500).json({error:"unable to add new recipe",errorDetails:err.message})
    }
})

async function getRecipeBy(recipeBy) {
    try {
        const foundRecipe = await Recipe.find(recipeBy)
        if (foundRecipe.length === 0 ) {
            console.log("recipe details is not available")
        }else return foundRecipe
    } catch(err) {
        console.log("an error occured while getting recipe")
    }
}

// get recipe details by title

app.get("title/:title",async (req,res)=>{
    const title = req.params.title
    const foundRecipe = await getRecipeBy({title})
    try {
        if (foundRecipe.length === 0) {
            return res.status(404).json({error:"unable to get recipe"})
        } else {
            return res.status(200).json({message:`recipe with title ${title} found successfully`,newlyAddedRecipe:foundRecipe})
        }

    } catch(err) {
        return res.status(500).json({error:"an error occured while getting recipe by title",errorDetails:err.message})
    }
})

// get recipe details by author name

app.get("author/:author",async(req,res)=>{
    const author = req.params.author
    try {
        const foundRecipe = await getRecipeBy({author})
        if (foundRecipe.length === 0 ) {
            return res.status(404).json({error:`recipe with author ${author} not founds`})
        } else {
            return res.status(200).json({message:"recipe found successfully",FoundRecipe:foundRecipe})
        }
    } catch(err) {
        return res.status(500).json({error:`unable to find recipie with author ${author}`,errorDetails:err.message})
    }
})

// get recipe details by difficulty level

app.get("/difficultyLevel/:difficulty",async (req,res)=>{
    const level = req.params.difficulty
    try {
        const foundRecipe = await getRecipeBy({difficulty: level})
        if (foundRecipe.length === 0 ) {
            return res.status(404).json({error:`recipie with difficulty level ${level} not found`})
        } else {
            return res.status(200).json({message:"recipe found successfully",foudRecipes:foundRecipe})
        }
    } catch (err) {
        res.status(500).json({error:"an error occured while getting data on the basis of difficulty level",erorDetails:err.message})

    }
})

// updateRecipe by id of difficulty level

async function updateById(recipeId,dataToUpdate) {
    try {
        const foundData = await Recipe.findByIdAndUpdate(recipeId,dataToUpdate,{new:true})
        return foundData
    } catch(err) {
        console.log("an error occured while updating recipw")
    }
}

app.post("/updateRecipe/:id",async(req,res)=>{
    const id = req.params.id
    try {
        const foundRecipe = await updateById(id,req.body)
        if (!foundRecipe) {
            return res.status(404).json({error:"Recipe not found"})
        } else {
            return res.status(200).json({message:"data updated successfully", updatedData:foundRecipe})
        }
    } catch(err) {
        return res.status(500).json({error:"an error occured while updating recipe",errorDetails:err.message})
    }
})

// updateRecipe details by title

async function updateBy(updateDataBy,dataToUpdate) {
    try {
        const updatedData = await Recipe.findOneAndUpdate(updateDataBy,dataToUpdate,{new:true})
        return updatedData
    } catch(err) {
        console.log("an error occured while updating recipe")
    }
}

app.post("/recipeUpdate/:title",async(req,res)=>{
    const title = req.params.title
    try {
        const updateRecipe = await updateBy({title},req.body)
        if (!updateRecipe) {
            return res.status(404).json({error:"Recipe not found"})
        } else {
            return res.status(200).json({message:"recipe updated successfully",updatedData:updateRecipe})
        }

    } catch(err) {
        return res.status(500).json({error:"unable to load updated data",errorDetails:err.message})
    }
})

async function deleteRecipe(id) {
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(id)
        return deletedRecipe
    } catch(err) {
        console.log("an error occured while delting recipe")
        throw err
    }
}

app.delete("/deleteCuisine/:id",async(req,res)=>{
    const id = req.params.id
    try {
        const deleteData = await deleteRecipe(id)
        if(!deleteData) {
            return res.status(404).json({error:"Recipe not found"})
        } else {
            return res.status(200).json({message:"recipie deleted successfully",DeletedRecipe:deleteData})
        }

    } catch(err) {
        return res.status(500).json({error:"an error occured while delting. recipie",errorDetails:err.message})
    }
})

const PORT = 3397

app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`)
})

