/**
 * Run with: npx tsx prisma/update-photos.ts
 * Maps celebrity names → portrait filenames we've generated
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const photoMap: Record<string, string> = {
  "Zendaya":               "/celebrities/portrait_f1.png",
  "Timothée Chalamet":     "/celebrities/portrait_m1.png",
  "Billie Eilish":         "/celebrities/portrait_f2.png",
  "Bad Bunny":             "/celebrities/portrait_m2.png",
  "Chris Hemsworth":       "/celebrities/portrait_m3.png",
  "Margot Robbie":         "/celebrities/portrait_f3.png",
  "Ryan Reynolds":         "/celebrities/portrait_m4.png",
};

async function main() {
  console.log("📸 Updating celebrity photos…");
  for (const [name, photo] of Object.entries(photoMap)) {
    const result = await prisma.celebrity.updateMany({
      where: { name },
      data: { photo },
    });
    console.log(`  ${result.count > 0 ? "✅" : "⚠️ "} ${name}`);
  }
  console.log("🎉 Done");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
