const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5010;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ey0gohf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const userCollection = client.db("userDB").collection("users");
    const spotCollection = client.db("travelWithSm").collection("spots");

    app.post("/user", async (req, res) => {
      try {
        const newUser = req.body;
        const result = await userCollection.insertOne(newUser);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    app.get("/users", async (req, res) => {
      const query = {};
      const user = await userCollection.find(query).toArray();
      res.send(user);
    });

    // post addList data
    app.post("/addList", async (req, res) => {
      try {
        const newAdd = req.body;
        console.log(newAdd);
        const result = await spotCollection.insertOne(newAdd);
        res.send(result);
      } catch {
        console.error(error);
      }
    });

    // Get for My list
    app.get("/myListSpot/:email", async (req, res) => {
      try {
        const listSpot = req.params.email;
        console.log(listSpot);
        const result = await spotCollection.find({ email: listSpot }).toArray();
        res.send(result);
      } catch {
        console.error(error);
      }
    });

    // get for view details
    app.get("/viewSpot/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await spotCollection.findOne(query);
        res.send(result);
      } catch {
        console.error(error);
      }
    });
  } finally {
  }
}
run(console.log());

app.get("/", async (req, res) => {
  res.send("Server up and running");
});

app.listen(port, () => console.log(`Server running on ${port}`));
