-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "post_slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "comment" TEXT NOT NULL,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "comments_post_slug_idx" ON "comments"("post_slug");

-- CreateIndex
CREATE INDEX "comments_is_approved_idx" ON "comments"("is_approved");
