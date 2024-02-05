import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.user.create({
        data: {
            id: 0,
            email: "knudel@pongers.io",
            name: "testUser0",
        },
    });
    await prisma.user.create({
        data: {
            id: 1,
            email: "knang@pongers.io",
            name: "testUser1",
        },
    });
    await prisma.user.create({
        data: {
            id: 2,
            email: "shmism@pongers.io",
            name: "testUser2",
        },
    });
    await prisma.user.create({
        data: {
            id: 3,
            email: "shmang@pongers.io",
            name: "testUser3",
        },
    });
    await prisma.user.create({
        data: {
            id: 1337,
            email: "rampushmair@pongers.io",
            name: "shmismshmang",
        },
    });

    /*     const pongers = await prisma.chat.create({
        data: {
            id: 0,
            name: "pongers public channel",
            dm: false,
            password: null,
        },
    }); */
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
