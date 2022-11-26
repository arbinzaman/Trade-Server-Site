const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require('dotenv').config();

// middle ware
app.use(cors());
app.use(express.json());





// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0@cluster0.nj2hkmy.mongodb.net/?retryWrites=true&w=majority`;
const uri = "mongodb+srv://arbin:6R9SMiuPbMiQZGSm@cluster0.nj2hkmy.mongodb.net/?retryWrites=true&w=majority";
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const catagoriesCollection = client.db('trade').collection('catagories');
        const itemsCollection = client.db("trade").collection("itemsList");
        const userCollection = client.db("trade").collection("usersList");
        app.get('/catagories', async (req, res) => {
            const query = {};
            const cursor = catagoriesCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })

        app.get("/catagories/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = await catagoriesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });


        // catagorie data load
        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = {};
            const cursor = await catagoriesCollection.find(query).toArray();
            const category_news = cursor.filter(n => n.category_id === id);
            res.send(category_news);
        })


        // Itmes that added for purchase with mail
        app.get("/items", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = await itemsCollection.find(query).toArray();;
            res.send(cursor);
        });

        // Itmes that added for purchase 
        app.get("/items", async (req, res) => {
            const query = {};
            const cursor = await itemsCollection.find(query);
            const reviews = await cursor.toArray();
            const reverseArray = reviews.reverse();
            res.send(reverseArray);
        });

        // userslist
        app.get("/usersList", async (req, res) => {
            const query = {};
            const cursor = await userCollection.find(query);
            const reviews = await cursor.toArray();
            const reverseArray = reviews.reverse();
            res.send(reverseArray);
        });

        app.post("/items", async (req, res) => {
            const items = req.body;
            const result = await itemsCollection.insertOne(items);
            res.send(result);
        });



        app.post("/usersList", async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        // app.get("/usersList/admin/:email", async (req, res) => {
        //     const email = req.params.email;
        //     const query ={email}
        //     const user = await userCollection.find(query);
        //     res.send({ isAdmin:user?.role === 'admin'});
        // });

        app.get('/usersList/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })


        app.put("/usersList/admin/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc, option);
            console.log(result);
            res.send(result);
        });


        // app.patch('/reviews/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const status = req.body.status
        //     const query = { _id: ObjectId(id) }
        //     const updatedDoc = {
        //         $set: {
        //             status: status
        //         }
        //     }
        //     const result = await orderCollection.updateOne(query, updatedDoc);
        //     res.send(result);
        // });


    }
    finally {

    }
};

run().catch(err => console.log(err));





// Initial message
app.get("/", (req, res) => {
    res.send("Learn With Fun!");
});

app.listen(port, () => {
    console.log("Learn with Fun site running on port:", port);
});
