// Save/retrieve scores

import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const scores = await prisma.score.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return NextResponse.json(scores);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch scores" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { score, accuracy, wpm } = await request.json();

    if (
      typeof score !== "number" ||
      typeof accuracy !== "number" ||
      typeof wpm !== "number"
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const newScore = await prisma.score.create({
      data: { score, accuracy, wpm },
    });

    return NextResponse.json(newScore, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to save score" },
      { status: 500 }
    );
  }
}
