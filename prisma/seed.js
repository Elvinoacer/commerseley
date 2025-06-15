// prisma/seed.ts
const { PrismaClient } = require("../src/generated/prisma");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();
async function main() {
  const email = "omondielvin@gmail.com";
  const password = "15032003@Elvino";
  const name = "Elvinoacer";

  // const existingSuperAdmin = await prisma.user.findFirst({
  //   where: { role: "SUPER_ADMIN" },
  // });

  // if (existingSuperAdmin) {
  //   return;
  // }

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
