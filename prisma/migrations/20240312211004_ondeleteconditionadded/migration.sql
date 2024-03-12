-- DropForeignKey
ALTER TABLE "Following" DROP CONSTRAINT "Following_followersId_fkey";

-- DropForeignKey
ALTER TABLE "Following" DROP CONSTRAINT "Following_followingId_fkey";

-- DropForeignKey
ALTER TABLE "LikesReply" DROP CONSTRAINT "LikesReply_replyId_fkey";

-- DropForeignKey
ALTER TABLE "LikesReply" DROP CONSTRAINT "LikesReply_userId_fkey";

-- DropForeignKey
ALTER TABLE "Likestweet" DROP CONSTRAINT "Likestweet_tweetId_fkey";

-- DropForeignKey
ALTER TABLE "Likestweet" DROP CONSTRAINT "Likestweet_userId_fkey";

-- DropForeignKey
ALTER TABLE "Replytweet" DROP CONSTRAINT "Replytweet_tweetId_fkey";

-- DropForeignKey
ALTER TABLE "Replytweet" DROP CONSTRAINT "Replytweet_userId_fkey";

-- DropForeignKey
ALTER TABLE "Tweet" DROP CONSTRAINT "Tweet_authorId_fkey";

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_followersId_fkey" FOREIGN KEY ("followersId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Replytweet" ADD CONSTRAINT "Replytweet_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Replytweet" ADD CONSTRAINT "Replytweet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likestweet" ADD CONSTRAINT "Likestweet_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likestweet" ADD CONSTRAINT "Likestweet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikesReply" ADD CONSTRAINT "LikesReply_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Replytweet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikesReply" ADD CONSTRAINT "LikesReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
