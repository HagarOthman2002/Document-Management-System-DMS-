import { PrismaClient } from "./generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: { email: "hagar@example.com" },
  });

  if (!existingUser) {
    const user = await prisma.user.create({
      data: {
        name: "Hagar",
        email: "hagar@example.com",
        password: "securePassword123",
        nid: "12345678901234",
      },
    });
    console.log(user);
  } else {
    console.log("User already exists:", existingUser);
  }
}

main()
  .catch((error) => {
    console.error(error.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
