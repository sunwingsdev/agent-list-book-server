const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

// import modules
const logoApi = require("./apis/logoApi/logoApi");
const homeContentsApi = require("./apis/homeContentsApi/homeContentsApi");

const corsConfig = {
  origin: ["http://localhost:5173", "*"],
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

async function connectWithRetry() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    console.log("MongoDB Connected ✅");

    // Start collections
    const logosCollection = client.db("agent-list-book").collection("logos");
    const homeContentsCollection = client
      .db("agent-list-book")
      .collection("homeContents");

    // Apis start
    app.use("/logos", logoApi(logosCollection));
    app.use("/home-contents", homeContentsApi(homeContentsCollection));
    // Apis end

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Ping successful");
  } catch (error) {
    console.error(
      "Failed to connect to MongoDB, retrying in 5 seconds...",
      error
    );
    setTimeout(connectWithRetry, 5000);
  }
}

connectWithRetry();

// =====basic set up=======
app.get("/", (req, res) => {
  res.send("Agent list book server is running");
});

app.listen(port, () => {
  console.log("Agent list book server is running on port:🔥", port);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("SIGINT signal received: closing MongoDB client");
  await client.close();
  process.exit(0);
});
