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
    await prisma.user.create({
        data: {
            id: 42,
            email: "admin@pongers.io",
            name: "admin",
        },
    });

    await prisma.chat.create({
        data: {
            id: 0,
            name: "pongers public channel",
            dm: false,
            password: null,
            isPrivate: false,
            chatUsers: {
                create: [
                    {
                        userId: 42,
                        owner: true,
                        admin: true,
                        blocked: false,
                        muted: false,
                        invited: false,
                    },
                ],
            },
        },
    });
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
