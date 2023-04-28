const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const main = async () => {
  // Connect to database
  await prisma.$connect();

  // upsert will find and update user. If no user is found, It will create one
  // create/update a new user
  const cornelius = await prisma.user.upsert({
    where: { username: 'cornMan' },
    update: {},
    create: {
      username: 'cornMan',
      email: 'cornman@email.com',
      // password: "" // NOTE: Null for now TODO: add validation
    },
  });

  // Create/update a new video
  const tutorial = await prisma.video.upsert({
    where: { video: 'https://www.youtube.com/watch?v=NlXfg5Pxxh8' },
    update: {},
    create: {
      video: 'https://www.youtube.com/watch?v=NlXfg5Pxxh8',
      creator: 'Bo Jenkins',
    },
  });

  await prisma.video.upsert({
    where: { video: 'https://www.youtube.com/watch?v=FMnlyi60avU' },
    update: {},
    create: {
      video: 'https://www.youtube.com/watch?v=FMnlyi60avU',
      creator: 'Cornelius Davis',
      reviews: {
        create: {
          review: 'This is interesting',
          userId: cornelius.id,
        },
      },
    },
  });

  // This will create a review
  // TODO: Create dynamically for user to create
  await prisma.reviews.create({
    data: {
      review: 'Lets Goooo',
      userId: cornelius.id,
      videoId: tutorial.id,
    },
  });

  // Query videos
  const allVideos = await prisma.video.findMany({});
  // Query Users
  const allUsers = await prisma.user.findMany({
    include: {
      reviews: true,
    },
  });
  // Query all Reviews
  const allReviews = await prisma.reviews.findMany({});
  console.dir({ allVideos, allUsers, allReviews }, { depth: null });
};

main()
  .then(async () => {
    // after commands are run, disconnect
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // Catch error, disconnect, exit.
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
