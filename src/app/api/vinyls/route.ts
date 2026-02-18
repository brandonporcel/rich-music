import { dbConnect } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import Vinyl from "@/models/Vinyl";

export async function GET() {
  await dbConnect();
  try {
    const vinyls = await Vinyl.find();
    return NextResponse.json(vinyls);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching vinyls" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { pass, vinyl } = await request.json();
    if (pass !== process.env.PASS) {
      throw new Error("Wrong password");
    }
    const newVinyl = new Vinyl(vinyl);
    const savedVinyl = await newVinyl.save();
    return NextResponse.json(savedVinyl);
  } catch (error) {
    console.error("Error:", error);

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 },
    );
  }
}
