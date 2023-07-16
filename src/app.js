const express = require('express');
const app = express();
require('dotenv').config();
const bcrypt = require('bcrypt');

const saltRounds = 10; // Number of salt rounds for bcrypt

// Hash the API key
const hashedAPIKey = bcrypt.hashSync(process.env.API_KEY, saltRounds);
// Verify an API key
const port = process.env.PORT || 8000;
require('./db/conn');
const Product = require('./model/mod');

app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Hey I am Live   ... /products--- for Listing items,/add_products --- for adding new product,/update/:id --- for updating and /delete/:id---- for deleting the product")
})
// adding data to the server...
app.post("/add_product", async (req, res) => {
    const apiKey = req.headers['bearer'];
    const isValidAPIKey = bcrypt.compareSync(apiKey, hashedAPIKey);
    if (isValidAPIKey) {
        try {
            const insertMan = new Product(req.body);
           
            const result = await insertMan.save();
            res.status(200).send(result)
        } catch (error) {
            res.status(400).send(error)
        }
    }
    else {
        res.status(403).json({ error: 'Permission denied' });
    }
})

// fetching data from the server
app.get("/products", async (req, res) => {
    try {
        const result = await Product.find()
        res.status(200).send(result)
    } catch (error) {
        res.status(400).send(error)
    }
}
)

// Now you can create the post del anything you want according to your use..
// updating country name by id .
app.patch("/update/:id", async (req, res) => {
    const apiKey = req.headers['bearer'];
    const isValidAPIKey = bcrypt.compareSync(apiKey, hashedAPIKey);
    if (isValidAPIKey) {
        try {
            const id = req.params.id;
            const updateStudent = await Product.updateOne({ _id: id }, req.body, {
                new: true
            });
            
            res.send(updateStudent);
        } catch (error) {
            res.status(400).send(error);
        }
    }
    else {
        res.status(403).json({ error: 'Permission denied' });
    }
});

// handling del...
app.delete("/delete/:id", async (req, res) => {
    const apiKey = req.headers['bearer'];
    console.log(apiKey)
    const isValidAPIKey = bcrypt.compareSync(apiKey, hashedAPIKey);
    if (isValidAPIKey) {
        try {
            const id = req.params.id;
            const updateStudent = await Product.deleteOne({ _id: id });
            res.send(updateStudent);
        } catch (error) {
            res.status(400).send(error);
        }
    }
    else {
        res.status(403).json({ error: 'Permission denieds' });
    }
});

app.listen(port, "localhost", () => {
    console.log("Server is running on ", port);
})