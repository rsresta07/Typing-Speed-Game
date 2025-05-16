import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const count = await prisma.sentence.count();
    if (count === 0) {
      return NextResponse.json({ sentence: "No sentence found." });
    }
    const randomIndex = Math.floor(Math.random() * count);
    const sentence = await prisma.sentence.findMany({
      skip: randomIndex,
      take: 1,
    });
    return NextResponse.json({ sentence: sentence[0].text });
  } catch (error) {
    console.error("Error fetching sentence:", error);
    return NextResponse.json(
      { sentence: "Error fetching sentence." },
      { status: 500 }
    );
  }
}
