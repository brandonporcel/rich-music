import { dbConnect } from "@/libs/mongodb";
import Vinyl from "@/models/Vinyl";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  await dbConnect();
  try {
    const { pass, vinyl } = await request.json();
    if (pass !== process.env.PASS) {
      throw new Error("Wrong password");
    }
    const updatedVinyl = await Vinyl.findOneAndUpdate({ _id: vinyl.id }, vinyl);
    return NextResponse.json(updatedVinyl);
  } catch (error) {
    console.error("Error:", error);

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}
