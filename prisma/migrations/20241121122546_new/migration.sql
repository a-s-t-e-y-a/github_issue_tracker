-- CreateTable
CREATE TABLE "username" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "slack_webhook" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "username_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "githubUrl" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "type_issues" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "usernameId" INTEGER NOT NULL,

    CONSTRAINT "githubUrl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "username_username_key" ON "username"("username");

-- CreateIndex
CREATE INDEX "username_username_idx" ON "username"("username");

-- CreateIndex
CREATE INDEX "githubUrl_url_idx" ON "githubUrl"("url");

-- AddForeignKey
ALTER TABLE "githubUrl" ADD CONSTRAINT "githubUrl_usernameId_fkey" FOREIGN KEY ("usernameId") REFERENCES "username"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
