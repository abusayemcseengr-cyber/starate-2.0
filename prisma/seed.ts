import { PrismaClient } from '@prisma/client';
import { celebrities } from '../lib/celebrities-data';
import { bangladeshiCelebrities } from '../lib/bangladeshi-celebrities';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding StarRate database...');

  // Assign demo photos to first few celebrities
  const photoPaths: Record<string, string> = {
    Zendaya: '/celebrities/portrait_f1.png',
    'Timothée Chalamet': '/celebrities/portrait_m1.png',
  };

  const allCelebrities = [...celebrities, ...bangladeshiCelebrities];

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const cel of allCelebrities) {
    try {
      const existing = await prisma.celebrity.findFirst({
        where: { name: cel.name },
      });

      if (existing) {
        skipped++;
        continue;
      }

      // Explicitly type cast string any properties if needed, but schema handles Strings
      // 'cel' can be either CelebrityData without a photo field or with it.
      // We will access (cel as any).photo to be totally safe in typescript if the type differs.
      // Ensure no empty photo strings reach the database
      const photoStr =
        photoPaths[cel.name] ||
        (cel as any).photo ||
        '/celebrities/placeholder.png';

      await prisma.celebrity.create({
        data: {
          name: cel.name,
          photo: photoStr,
          bio: cel.bio,
          category: cel.category,
          nationality: cel.nationality,
          avgRating: 0,
          totalVotes: 0,
        },
      });
      created++;
      console.log(`  ✅ ${cel.name}`);
    } catch (error) {
      console.error(`  ❌ Failed to insert ${cel.name}:`, error);
      errors++;
    }
  }

  console.log(
    `\n🎉 Done — ${created} created, ${skipped} skipped (already existed), ${errors} errors.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
