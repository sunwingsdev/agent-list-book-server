const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

// import modules
const logoApi = require("./apis/logoApi/logoApi");
const homeContentsApi = require("./apis/homeContentsApi/homeContentsApi");
const dataApi = require("./apis/dataApi/dataApi");
const headlineApi = require("./apis/headlineApi/headlineApi");
const usersApi = require("./apis/usersApi/usersApi");

const corsConfig = {
  origin: [
    "http://localhost:5173",
    "*",
    "https://agentlist.oracletechnology.net",
    "http://agentlist.oracletechnology.net",
    "www.agentlist.oracletechnology.net",
    "agentlist.oracletechnology.net",
  ],
  credentials: true,
  optionSuccessStatus: 200,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
};

// =====middlewares======
app.use(cors(corsConfig));
app.options("", cors(corsConfig));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1xm2m6f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // collection start
    const logosCollection = client.db("agent-list-book").collection("logos");
    const homeContentsCollection = client
      .db("agent-list-book")
      .collection("homeContents");
    const dataCollection = client.db("agent-list-book").collection("data");
    const headlineCollection = client
      .db("agent-list-book")
      .collection("headline");
    const usersCollection = client.db("agent-list-book").collection("users");

    // collection end

    // Apis start
    app.use("/logos", logoApi(logosCollection));
    app.use("/home-contents", homeContentsApi(homeContentsCollection));
    app.use("/data", dataApi(dataCollection));
    app.use("/headline", headlineApi(headlineCollection));
    app.use("/users", usersApi(usersCollection));
    // Apis end

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB Connected ✅");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// =====basic set up=======
app.get("/", (req, res) => {
  res.send("Agent list book server is running");
});

app.listen(port, () => {
  console.log("Agent list book server is running on port:🔥", port);
});
