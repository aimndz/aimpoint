import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        password: "password123",
      },
      {
        id: "2",
        firstName: "Amiel",
        lastName: "Ian",
        username: "amielian",
        password: "password123",
      },
    ],
  });

  await prisma.post.createMany({
    data: [
      {
        id: "1",
        title: "First Post",
        content: "This is the content of the first post.",
        userId: "1",
      },
      {
        id: "2",
        title: "Second Post",
        content: "This is the content of the second post.",
        userId: "2",
      },
    ],
  });

  await prisma.comment.createMany({
    data: [
      {
        text: "First Comment",
        postId: "1",
        userId: "1",
      },
      {
        text: "Second Comment",
        postId: "2",
        userId: "1",
      },
      {
        text: "Third Comment",
        postId: "2",
        userId: "2",
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
