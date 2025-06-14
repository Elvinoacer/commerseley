// prisma/seed.ts
const { PrismaClient } = require("../src/generated/prisma");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();
async function main() {
  const email = "admin@gmail.com";
  const password = "123456";
  const name = "Elvin";

  const existingSuperAdmin = await prisma.user.findFirst({
    where: { role: "SUPER_ADMIN" },
  });

  if (existingSuperAdmin) {
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const superAdminUser = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });
  console.log("User created:", superAdminUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
