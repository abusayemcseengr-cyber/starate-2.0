import { PrismaClient } from "@prisma/client";
import { celebrities } from "../lib/celebrities-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding StarRate database...");

  // Assign demo photos to first few celebrities
  const photoPaths: Record<string, string> = {
    Zendaya:         "/celebrities/portrait_f1.png",
    "Timothée Chalamet": "/celebrities/portrait_m1.png",
  };

  let created = 0;
  let skipped = 0;

  for (const cel of celebrities) {
    const existing = await prisma.celebrity.findFirst({
      where: { name: cel.name },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.celebrity.create({
      data: {
        name: cel.name,
        photo: photoPaths[cel.name] ?? "",
        bio: cel.bio,
        category: cel.category,
        nationality: cel.nationality,
        avgRating: 0,
        totalVotes: 0,
      },
    });
    created++;
    console.log(`  ✅ ${cel.name}`);
  }

  console.log(
    `\n🎉 Done — ${created} created, ${skipped} skipped (already existed).`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
