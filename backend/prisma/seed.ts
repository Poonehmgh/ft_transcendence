import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const knudel = await prisma.user.create({
        data: {
            id: 42,
            email: "knudel@pongers.io",
            name: "knudel",
        },
    });
    const knang = await prisma.user.create({
        data: {
            id: 69,
            email: "knang@pongers.io",
            name: "knang",
        },
    });
    const shmism = await prisma.user.create({
        data: {
            id: 420,
            email: "shmism@pongers.io",
            name: "shmism",
        },
    });
    const shmang = await prisma.user.create({
        data: {
            id: 1337,
            email: "shmang@pongers.io",
            name: "shmishmangsm",
        },
    });

    console.log({ knudel, knang });
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
