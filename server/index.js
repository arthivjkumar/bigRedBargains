const { v4: uuidv4 } = require('uuid'); const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');


const app = express();

app.use(cors());
app.use(express.json());

const dotenv = require('dotenv');
dotenv.config();

let collection;

// MongoDB connection
async function connectToDatabase() {
  try {
    console.log('Attempting to connect to MongoDB with URI:', mongoURI);
    await client.connect();
    collection = client.db("BigRedBargains").collection("Listings");
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}
const mongoURI = process.env.MONGO_URL
const PORT = process.env.PORT;

const client = new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


// routes

app.post('/addItem', cors(), async (req, res) => {
  collection = client.db("BigRedBargains").collection("Listings");
  const { seller, name, description, cost, image } = req.body
  const itemId = uuidv4(); // generates unique identifier for item
  // const {id, email, iat} = jwt.verify(token, JWT_SECRET)
  try {
    const itemData = {
      sellerID: seller,
      itemID: itemId,
      name: name,
      description: description,
      cost: cost,
      image: image,
      saved: false
    };
    await collection.insertOne(itemData); // Insert the request payload into the database
    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error("Error accessing endpoint:", error); // Log the error
    res.status(500).json({ error: 'Internal Server Error' }); // Send an error response to the client
  }
})

app.get('/getItems', async (req, res) => {
  try {
    // Connect to the database
    await client.connect();
    const collection = client.db("BigRedBargains").collection("Listings");

    // Define the query
    const query = { sellerID: "kln47" };

    // Fetch the items
    const items = await collection.find(query).toArray();

    // Map the items to the desired format
    const formattedItems = items.map(item => [
      item.itemID,
      item.name.charAt(0).toUpperCase() + item.name.slice(1),
      item.description,
      item.cost,
      item.image,
      item.saved
    ])

    // Remove duplicates if necessary
    const uniqueItems = Array.from(new Set(formattedItems.map(JSON.stringify))).map(JSON.parse);

    res.json(uniqueItems);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.post('/saveItem', cors(), async (req, res) => {
  collection = client.db("BigRedBargains").collection("Listings");
  const { itemId, saved } = req.body
  // Define the query
  const query = { itemID: itemId };

  const result = await collection.updateOne(query,
    {
      $set: {
        saved: saved
      }
    }
  )
  if (result.matchedCount === 0) {
    return res.status(404).json({ error: 'Item not found' });
  }

  res.json({ message: 'Data updated successfully' });
})

app.get('/getSaved', cors(), async (req, res) => {
  collection = client.db("BigRedBargains").collection("Listings");
  try {
    // Define the query
    const query = { saved: true };

    const items = await collection.find(query).toArray();

    const formattedItems = items.map(item => [
      item.itemID,
      item.name.charAt(0).toUpperCase() + item.name.slice(1),
      item.description,
      item.image
    ])

    // Remove duplicates if necessary
    const uniqueItems = Array.from(new Set(formattedItems.map(JSON.stringify))).map(JSON.parse);

    res.json(uniqueItems);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
})

async function startServer() {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer()