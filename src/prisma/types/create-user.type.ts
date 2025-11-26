import { Prisma } from '@prisma/client';

export type CreatedUser = Prisma.UserGetPayload<{
  select: {
    id: true;
    firstName: true;
    lastName: true;
    email: true;
    createdAt: true;
  };
}>;
