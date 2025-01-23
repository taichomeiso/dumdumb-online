const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = "admin@example.com";
  const password = "adminpassword";

  // パスワードをハッシュ化
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // 管理者ユーザーを作成または更新
    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        hashedPassword,
        role: "admin",
      },
      create: {
        email,
        hashedPassword,
        role: "admin",
        name: "Administrator",
      },
    });

    console.log('Admin user created/updated:', admin.email);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });