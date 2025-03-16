import { dbConnect } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import Vinyl from "@/models/Vinyl";

export async function GET() {
  await dbConnect();
  try {
    const vinyls = await Vinyl.aggregate([{ $sample: { size: 20 } }]);
    return NextResponse.json(vinyls, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching vinyls" }, { status: 500 });
  }
}

