import { PrismaClient } from "../src/generated/prisma/index.js";
const prisma = new PrismaClient();

const sentences = [
  "Life is what happens when you're busy making other plans.",
  "The only limit to our realization of tomorrow is our doubts of today.",
  "In the middle of difficulty lies opportunity.",
  "Success usually comes to those who are too busy to be looking for it.",
  "Don't watch the clock; do what it does. Keep going.",
  "The future belongs to those who believe in the beauty of their dreams.",
  // Add many more here...
];

async function main() {
  for (const text of sentences) {
    await prisma.sentence.upsert({
      where: { text },
      update: {},
      create: { text },
    });
  }
  console.log("Seeding completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
