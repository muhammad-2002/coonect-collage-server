const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const port = process.env.PORT|| 3000

app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion } = require('mongodb'); 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iwngqer.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const database = client.db("connect-Collage");
     const userCollection = database.collection('users');
    
     app.post("/user", async (req, res) => {
      const user = req.body
      const email = req.body.email
      const query = {email:email}
      const isExist =await userCollection.findOne(query)
      if(isExist){
        return res.send({
          message:'user Already Exist',
          insertedId:null,
        })
      }
      const result = await userCollection.insertOne(user)
     
      res.send({message:'successfully Inserted'})
    });

    app.get('/user/:email',async(req,res)=>{
      const email = req.params.email
      const query = {email:email}
      const result = await userCollection.findOne(query)
      console.log(result)
      res.send(result)
      
    })
    app.patch('/user/:email',async(req,res)=>{
      const user = req.body
      console.log(user)
      const email = req.params.email
      console.log(email)
      const filter = {email:email};
      const updateDoc ={
        $set:{
          ...user
        }
      }
      const result = await userCollection.updateOne(filter, updateDoc);
      console.log(result)
      res.send(result)
    })  

    // app.get('/user', async (req, res) => {
    //     const { email } = req.params;
    //     console.log(email)
    
    //     try {
    //         const result = await userCollection.findOne({ email: email });
    //         console.log(result);
    //         if (!result) {
    //             return res.status(404).send({ message: 'User not found' });
    //         }
    
    //         res.send({ message: 'success', user: result });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).send({ message: 'Error retrieving user' });
    //     }
    // });
    
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });