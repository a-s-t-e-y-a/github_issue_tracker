import { username } from '@prisma/client';

export interface CreateResponse {
  message?: string;
  data: username;
}