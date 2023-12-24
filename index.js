const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();

//middelware
app.use(cors());
app.use(express.json());


//mongodb connections

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jz0ivtr.mongodb.net/?retryWrites=true&w=majority`;

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

    const productsCollection = client.db('emajohndb').collection('products');

    app.get('/products', async(req,res) =>{
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const skip = page*limit;
        const result = await productsCollection.find().skip(skip).limit(limit).toArray();
        res.send(result);
    })

    app.post('/productsByIds', async(req,res) =>{
      const orderProductsId = req.body
      console.log(orderProductsId)
      const objectId = orderProductsId.map(id => new ObjectId(id))
      console.log(objectId)
      const query = { _id: {$in: objectId}}
      
      const result = await productsCollection.find(query).toArray()
      res.send(result)
    })

    app.get('/totalProducts', async(req,res) =>{
        const result = await productsCollection.estimatedDocumentCount();
        res.send({totalProducts: result});
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


app.get('/', (req,res) =>{
    res.send('Ema John Server is running!!!....')
})

app.listen(port, ()=>{
    console.log("Ema John Server is running on port : ",port);
})