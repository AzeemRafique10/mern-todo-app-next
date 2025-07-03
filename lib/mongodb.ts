// lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export const db = client.db("Cluster0"); // replace with your DB name
export const todosCollection = db.collection("todos");
