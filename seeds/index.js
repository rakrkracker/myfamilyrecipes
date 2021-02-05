// Libraries
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const recipes = require('./recipes');
const Recipe = require('../models/recipe');


// Connect to database
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/family-recipes';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Database connected');
});


// Seed database
const seedDB = async () => {
    await Recipe.deleteMany({});
    for (let recipe of recipes) {
        const newRecipe = new Recipe({ ...recipe });
        await newRecipe.save();
    }
}

seedDB().then(() => mongoose.connection.close());