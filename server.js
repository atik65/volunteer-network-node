const { MongoClient } = require("mongodb");
require("dotenv").config();
const express = require("express");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASS}@cluster0.tx5hg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// const uri = `mongodb+srv://volunteer:Swps3BAyq0fzr0xO@cluster0.tx5hg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// server connecting to mongodb atlas server

const run = async () => {
  try {
    await client.connect();

    const database = client.db("EventsDB");
    const eventsCollection = database.collection("events");
    const voluneerCollection = database.collection("volunteers");

    // create a events  api
    app.post("/events", async (req, res) => {
      const newEvent = req.body;

      const result = await eventsCollection.insertOne(newEvent);
      res.json(result);
    });

    // read or get all volunteer api
    app.get("/events", async (req, res) => {
      const cursor = eventsCollection.find({});
      const events = await cursor.toArray();

      res.json(events);
    });

    // update events api
    app.put("/events/:id", async (req, res) => {
      const id = req.params.id;
      const updatedEvent = req.body;

      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          img: updatedEvent.img,
          title: updatedEvent.title,
          color: updatedEvent.color,
        },
      };
      const result = await eventsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // event delete api
    app.delete("/events/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };
      const result = await eventsCollection.deleteOne(query);
      res.json(result);
    });

    // get a single event api
    app.get("/events/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };
      const singleEvent = await eventsCollection.findOne(query);
      res.json(singleEvent);
    });

    // create a volunteer api
    app.post("/volunteer", async (req, res) => {
      const newVolunteer = req.body;

      const result = await voluneerCollection.insertOne(newVolunteer);
      res.json(result);
    });

    // get all volunteer api
    app.get("/volunteer", async (req, res) => {
      const cursor = voluneerCollection.find({});
      const volunteers = await cursor.toArray();
      res.json(volunteers);
    });

    // get volunteers filtered by specific email api
    app.get("/voluteer/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };

      const cursor = voluneerCollection.find(query);
      const volunteers = await cursor.toArray();

      res.json(volunteers);
    });

    // delete a volunteer api
    app.delete("/volunteer/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };

      const result = await voluneerCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
};

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from Voluneers Node server");
});

app.listen(port, () => {
  console.log("Listening port at : ", port);
});
