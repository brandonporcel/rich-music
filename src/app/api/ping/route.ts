import { NextResponse } from "next/server";

export async function GET() {
  // await connectMongo();

  // try {
  //   const vinyls = await Vinyl.find();
  //   return NextResponse.json(vinyls);
  // } catch (error) {
  //   console.error("Error retrieving vinyls: ", error);
  //   return NextResponse.error();
  // }

  return NextResponse.json({
    message: "hola",
  });
}
