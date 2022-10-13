import prisma from '../../../db/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const recipeName = req.query['recipe'];

  if (!recipeName || typeof recipeName !== 'string') {
    res.statusCode = 404;

    res.send(JSON.stringify({ message: 'Not found' }));

    return;
  }

  const recipe = await prisma.recipe.findFirst({
    where: {
      title: recipeName,
    },
  });

  const ingredients = await prisma.recipe
    .findFirst({
      where: {
        title: recipeName,
      },
    })
    .ingredients();

  const directions = await prisma.direction.findMany({
    where: {
      recipeId: {
        equals: recipe.id,
      },
    },
  });

  if (!recipe) {
    res.statusCode = 404;

    res.send(JSON.stringify({ message: 'Recipe not found' }));

    return;
  }

  return res.json({ recipe, ingredients, directions });
};
