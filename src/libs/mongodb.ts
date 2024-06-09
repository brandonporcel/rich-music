import { connect, connection } from "mongoose";

const conn = {
  isConnected: false,
};

export async function dbConnect() {
  if (conn.isConnected) {
    return;
  }

  try {
    const db = await connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/nextjs"
    );
    conn.isConnected = Boolean(db.connections[0].readyState);
  } catch (error: any) {
    console.error("Mongodb connection error:", error.message);
  }
}

connection.on("connected", () => console.log("Mongodb connected to db"));
connection.on("error", (err) => console.error("Mongodb error:", err.message));
