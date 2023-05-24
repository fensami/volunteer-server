const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


//middlewere
app.use(cors())
app.use(express.json())

console.log(process.env.DB_USER);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fs0mclr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const eventCollection = client.db('volunteer').collection('events');
        const volunteerCollection = client.db('volunteer').collection('volunteerData');

        app.get('/volunteerData', async(req, res) => {
            const cursor = volunteerCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })



        // app.get('/events', async(req, res) => {
        //     const cursor = eventCollection.find()
        //     const result = await cursor.toArray();
        //     res.send(result)
        //   })

        app.get('/events/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const user = await eventCollection.findOne(query)
            res.send(user)
        })

        app.post('/events', async (req, res) => {
            const event = req.body;
            console.log(event);
            const result = await eventCollection.insertOne(event);
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('volunteer is running')
})

app.listen(port, () => {
    console.log(`volunteer server is running on port${port}`)
})