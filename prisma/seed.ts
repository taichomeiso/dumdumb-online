import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // カテゴリーの作成
  const tshirtCategory = await prisma.category.create({
    data: {
      name: 'Tシャツ',
    },
  });

  const hoodieCategory = await prisma.category.create({
    data: {
      name: 'パーカー',
    },
  });

  // 商品の作成
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'ベーシックTシャツ',
        description: '柔らかな肌触りの上質なコットンを使用したベーシックなTシャツです。',
        price: 3900,
        imageUrl: '/api/placeholder/400/400',
        stock: 50,
        categories: {
          connect: { id: tshirtCategory.id },
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'プレミアムパーカー',
        description: '上質な素材を使用した、着心地の良いパーカーです。',
        price: 7900,
        imageUrl: '/api/placeholder/400/400',
        stock: 30,
        categories: {
          connect: { id: hoodieCategory.id },
        },
      },
    }),
    prisma.product.create({
      data: {
        name: 'グラフィックTシャツ',
        description: 'オリジナルのグラフィックデザインがプリントされたTシャツです。',
        price: 4900,
        imageUrl: '/api/placeholder/400/400',
        stock: 40,
        categories: {
          connect: { id: tshirtCategory.id },
        },
      },
    }),
  ]);

  console.log('Seed data created:', { categories: [tshirtCategory, hoodieCategory], products });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });