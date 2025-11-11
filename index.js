const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require('dotenv').config();

// middle ware
app.use(cors({
    origin: '*',          // allow requests from any origin
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

// const uri = "mongodb+srv://arbin:6R9SMiuPbMiQZGSm@cluster0.nj2hkmy.mongodb.net/?retryWrites=true&w=majority";
// console.log(uri);
const uri = "mongodb+srv://redoxop45_db_user:a1s1d1f1@trade-project.kuqdbsb.mongodb.net/?appName=trade-project";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const catagoriesCollection = client.db('trade').collection('catagories');
        const itemsCollection = client.db("trade").collection("itemsList");
        const userCollection = client.db("trade").collection("usersList");
        const productsCollection = client.db("trade").collection("myProducts");
        const advertiseCollection = client.db("trade").collection("advertise");
        app.get('/catagories', async (req, res) => {
            const query = {};
            const cursor = catagoriesCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })

        // dropdown option
        app.get('/catagoriesoption', async (req, res) => {
            const query = {};
            const cursor = catagoriesCollection.find(query).project({ brand: 1 });
            const users = await cursor.limit(3).toArray();
            res.send(users);
        })

        // app.get("/catagories/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const cursor = await catagoriesCollection.find(query);
        //     const services = await cursor.toArray();
        //     res.send(services);
        // });

        app.get("/catagories/:id", async (req, res) => {
    const id = req.params.id; // "1", "2", etc
    const query = { category_id: id }; // use your custom field
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
            res.send(reviews);
        });

        app.post("/items", async (req, res) => {
            const items = req.body;
            const result = await itemsCollection.insertOne(items);
            res.send(result);
        });
        app.post("/catagories", async (req, res) => {
            const items = req.body;
            console.log(items);
            const result = await catagoriesCollection.insertOne(items);
            res.send(result);
        });

        // products collection
        app.post("/myProducts", async (req, res) => {
            const items = req.body;
            console.log(items);
            const result = await productsCollection.insertOne(items);
            res.send(result);
        });
        app.get("/myProducts", async (req, res) => {
            const query = {};
            const cursor = await productsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.delete("/myProducts/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });

        // advertise

        app.post("/advertise", async (req, res) => {
            const items = req.body;
            console.log(items);
            const result = await advertiseCollection.insertOne(items);
            res.send(result);
        });

        app.get("/advertise", async (req, res) => {
            const query = {};
            const cursor = await advertiseCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.delete("/advertise/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await advertiseCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });




        app.post("/usersList", async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        });
        // admin api
        app.get('/usersList/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })

        // sellerapi
        app.get('/usersList/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollection.findOne(query);
            res.send({ isSeller: user?.role === 'seller' });
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



        app.delete("/usersList/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });



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
