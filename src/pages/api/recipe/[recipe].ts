import prisma from '../../../db/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const recipeSlug = req.query['recipe'];

  if (!recipeSlug || typeof recipeSlug !== 'string') {
    res.statusCode = 404;
    res.send(JSON.stringify({ message: 'Not found' }));
    return;
  }

  const recipe = await prisma.recipe.findFirst({
    where: {
      title: recipeSlug,
    },
  });

  const ingredients = await prisma.recipe
    .findFirst({
      where: {
        title: recipeSlug,
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

  console.log(recipe, ingredients, directions);

  return res.json({ recipe, ingredients, directions });
};
