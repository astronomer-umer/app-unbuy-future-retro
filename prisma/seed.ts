const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
     // Seed Categories
     const categories = [
          { name: 'Electronics', icon: '📱' },
          { name: 'Furniture', icon: '🛋️' },
          { name: 'Clothing', icon: '👗' },
          { name: 'Vehicles', icon: '🚗' },
          { name: 'Toys & Games', icon: '🧸' },
          { name: 'Sports', icon: '⚽' },
          { name: 'Books', icon: '📚' },
          { name: 'Jewelry', icon: '💍' },
          { name: 'Home & Garden', icon: '🏡' },
          { name: 'Beauty', icon: '💄' },
          { name: 'Music', icon: '🎵' },
          { name: 'Art', icon: '🎨' },
     ];

     for (const category of categories) {
          await prisma.category.upsert({
               where: { name: category.name },
               update: {},
               create: category,
          });
     }

     // Seed Users
     const user = await prisma.user.upsert({
          where: { email: 'admin@example.com' },
          update: {},
          create: {
               name: 'Admin User',
               email: 'admin@example.com',
               password: 'securepassword', // Replace with a hashed password
               image: fs.readFileSync('./public/placeholder-user.jpg', { encoding: 'base64' }),
          },
     });

     console.log('Database seeded successfully!');
}

main()
     .catch((e) => {
          console.error(e);
          process.exit(1);
     })
     .finally(async () => {
          await prisma.$disconnect();
     });