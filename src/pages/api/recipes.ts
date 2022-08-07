import prisma from '../../db/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const data = await prisma.Recipe.findMany();

  if (!data) {
    res.statusCode = 404;

    res.send(JSON.stringify({ message: 'No recipes' }));

    return;
  }

  return res.status(200).json(data);
};
