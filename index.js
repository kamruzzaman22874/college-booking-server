const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.apl9htr.mongodb.net/?retryWrites=true&w=majority`;

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

    const collegeCollection = client.db("collegeBooking").collection("college");
    const addimissionCollection = client.db("collegeBooking").collection("addimission");
    const reviewCollection = client.db("collegeBooking").collection("review");

    app.get("/college", async(req, res) => {
         const result = await collegeCollection.find({}).toArray();
         res.send(result);
    })

    app.get("/colleges/:id", async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await collegeCollection.findOne(query);
        res.send(result);
    })
    app.get("/addmission", async (req , res) =>{
        const result = await collegeCollection.find({}).toArray();
        res.send(result);
    })

    app.get("/review", async (req , res) =>{
      const result = await reviewCollection.find({}).toArray();
      res.send(result);
    })

    app.post("/review", async (req,res) =>{
      const reviewItem = req.body;
      const result = await reviewCollection.insertOne(reviewItem);
      res.send(result);
    })

    app.post("/addmissions", async (req, res) => {
      const addmissionInfo = req.body;
      const result = await addimissionCollection.insertOne(addmissionInfo);
      res.send(result);
    });

    app.get("/addmissions", async(req, res) =>{
      const result = await addimissionCollection.find({}).toArray();
      res.send(result);
    })


    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
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
  res.send('College booking server is running')
})

app.listen(port, () => {
  console.log(`College booking server is running on port ${port}`)
})