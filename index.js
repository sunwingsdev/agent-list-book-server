const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

// Import modules
const logoApi = require("./apis/logoApi/logoApi");
const homeContentsApi = require("./apis/homeContentsApi/homeContentsApi");

const corsConfig = {
  origin: ["http://localhost:5173", "*"],
  credentials: true,
  optionSuccessStatus: 200,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
};

// ===== Middlewares =====
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
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("MongoDB Connected ✅");

    // Collection start
    const logosCollection = client.db("agent-list-book").collection("logos");
    const homeContentsCollection = client
      .db("agent-list-book")
      .collection("homeContents");

    // APIs start
    app.use("/logos", logoApi(logosCollection));
    app.use("/home-contents", homeContentsApi(homeContentsCollection));
    // APIs end

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
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
