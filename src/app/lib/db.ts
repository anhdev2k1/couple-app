/* eslint-disable no-var */
import { MongoClient } from "mongodb";

// Declare the global variable type
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

// const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(
      "mongodb+srv://jackrover889:S4fVgxgiliiYH9M6@cluster0.phb1imj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      options
    );
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(
    "mongodb+srv://jackrover889:S4fVgxgiliiYH9M6@cluster0.phb1imj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    options
  );
  clientPromise = client.connect();
}

export default clientPromise;
