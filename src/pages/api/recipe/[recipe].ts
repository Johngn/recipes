import prisma from '../../../db/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const recipe = req.query['recipe'];

  if (!recipe || typeof recipe !== 'string') {
    res.statusCode = 404;

    res.send(JSON.stringify({ message: 'Not found' }));

    return;
  }

  const data = await prisma.Recipe.findFirst({
    where: {
      title: {
        equals: recipe,
      },
    },
  });

  const ingredients = await prisma.Ingredient.findMany({
    where: {
      recipeId: {
        equals: data.id,
      },
    },
  });

  const directions = await prisma.Direction.findMany({
    where: {
      recipeId: {
        equals: data.id,
      },
    },
  });

  data.ingredients = ingredients;
  data.directions = directions;

  if (!data) {
    res.statusCode = 404;

    res.send(JSON.stringify({ message: 'Recipe not found' }));

    return;
  }

  return res.json(data);
};
