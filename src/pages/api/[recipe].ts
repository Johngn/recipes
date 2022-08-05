import prisma from '../../db/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const recipe = req.query['recipe'];

  if (!recipe || typeof recipe !== 'string') {
    res.statusCode = 404;

    res.send(JSON.stringify({ message: 'Not found' }));

    return;
  }

  const data = await prisma.Recipe.findFirst({
    // console.log(data);
    where: {
      title: {
        equals: recipe,
      },
    },
  });

  if (!data) {
    res.statusCode = 404;

    res.send(JSON.stringify({ message: 'Recipe not found' }));

    return;
  }

  res.send(JSON.stringify({ message: `Recipe is ${data.title}` }));

  return;
};
