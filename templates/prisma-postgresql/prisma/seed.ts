import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 기존 데이터 삭제 (개발 환경에서만)
  await prisma.user.deleteMany();

  // 샘플 사용자 생성
  const hashedPassword = await hash("password123", 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@example.com",
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        email: "user@example.com",
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        email: "test@example.com",
        password: hashedPassword,
      },
    }),
  ]);

  console.log("Created users:", users);
  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
