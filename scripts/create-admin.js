const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  try {
    // 既存のユーザーを削除
    await prisma.user.deleteMany({
      where: {
        email: "admin@example.com"
      }
    });

    // 新しい管理者ユーザーを作成
    const hashedPassword = await bcrypt.hash("adminpassword", 10);
    const admin = await prisma.user.create({
      data: {
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        name: "Admin User"
      }
    });

    console.log("Admin user created successfully:", admin.email);
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();