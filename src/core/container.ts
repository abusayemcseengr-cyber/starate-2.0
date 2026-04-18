import { PrismaClient } from '@prisma/client';
import { PrismaCelebrityRepository } from './celebrities/infrastructure/PrismaCelebrityRepository';
import { PrismaRatingRepository } from './ratings/infrastructure/PrismaRatingRepository';
import { PrismaUserRepository } from './users/infrastructure/PrismaUserRepository';
import { GetNextCelebrityUseCase } from './celebrities/application/GetNextCelebrityUseCase';
import { SubmitRatingUseCase } from './ratings/application/SubmitRatingUseCase';
import { RegisterUserUseCase } from './users/application/RegisterUserUseCase';
import { VerifyCredentialsUseCase } from './users/application/VerifyCredentialsUseCase';
import { prisma } from '../../lib/prisma'; // Assumes you have a singleton in lib/prisma.ts

const celebrityRepo = new PrismaCelebrityRepository(prisma as PrismaClient);
const ratingRepo = new PrismaRatingRepository(prisma as PrismaClient);
const userRepo = new PrismaUserRepository(prisma as PrismaClient);

export const getNextCelebrityUseCase = new GetNextCelebrityUseCase(
  celebrityRepo
);
export const submitRatingUseCase = new SubmitRatingUseCase(
  ratingRepo,
  celebrityRepo
);
export const registerUserUseCase = new RegisterUserUseCase(userRepo);
export const verifyCredentialsUseCase = new VerifyCredentialsUseCase(userRepo);

export { celebrityRepo, ratingRepo, userRepo };
