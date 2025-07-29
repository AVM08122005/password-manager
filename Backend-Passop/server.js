import express from "express";
import "dotenv/config";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";

const url = process.env.MONGO_URI;
const client = new MongoClient(url);

const dbName = "passop";

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

await client.connect();
console.log("Connected successfully to MongoDB server");

const db = client.db(dbName);
const collection = db.collection("passwords");

// Get all passwords
app.get("/", async (req, res) => {
  try {
    const passwords = await collection.find({}).toArray();
    res.json(passwords);
  } catch (error) {
    console.error("Error fetching passwords:", error);
    res.status(500).json({ error: "Failed to fetch passwords" });
  }
});

// Save a new password
app.post("/", async (req, res) => {
  try {
    const { website, username, password } = req.body;
    
    if (!website || !username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    if (website.length < 4 || username.length < 4 || password.length < 4) {
      return res.status(400).json({ error: "All fields must be at least 4 characters" });
    }

    const newPassword = {
      website,
      username,
      password,
      createdAt: new Date()
    };

    const result = await collection.insertOne(newPassword);
    
    res.status(201).json({
      success: true,
      password: {
        _id: result.insertedId,
        ...newPassword
      }
    });
  } catch (error) {
    console.error("Error saving password:", error);
    res.status(500).json({ error: "Failed to save password" });
  }
});

// Update a password
app.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { website, username, password } = req.body;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    
    if (!website || !username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    if (website.length < 4 || username.length < 4 || password.length < 4) {
      return res.status(400).json({ error: "All fields must be at least 4 characters" });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { website, username, password, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Password not found" });
    }
    
    res.json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Failed to update password" });
  }
});

// Delete a password
app.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 1) {
      res.json({ success: true, message: "Password deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Password not found" });
    }
  } catch (error) {
    console.error("Error deleting password:", error);
    res.status(500).json({ error: "Failed to delete password" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});