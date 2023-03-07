const express = require("express");
var cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
// to receive sent data we should use this middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e4yec41.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const database = client.db("geniusCar");
    const serviceCollection = database.collection("serviceCollection");
    const ordersCollection = database.collection("ordersCollection");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    app.post("/checkout", async (req, res) => {
      const order = req.body;
      const insertOrder = await ordersCollection.insertOne(order);
      res.send({
        status: "success",
      });
    });
  } finally {
  }
}

run().catch((error) => console.error);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
