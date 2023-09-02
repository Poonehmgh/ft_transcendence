-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "intraID" TEXT NOT NULL,
    "passHash" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "badgeName" TEXT NOT NULL,
    "chatStatus" TEXT NOT NULL,
    "friends" INTEGER[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
