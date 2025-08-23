import { NextResponse } from "next/server";
import Vinyl from "@/models/Vinyl";
import { dbConnect } from "@/libs/mongodb";

export async function GET(_req: Request, { params }: { params: { numero: string } }) {
  try {
    await dbConnect();
    const vinyls = await Vinyl.aggregate([{ $sample: { size: +params.numero } }]);

    return NextResponse.json(vinyls, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("❌ Error en API:", error);
    return NextResponse.json({ error: "Error fetching vinyls" }, { status: 500 });
  }
}
