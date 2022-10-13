import prisma from '../../db/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const createRecipe = await prisma.recipe.create({
        data: {
          title: req.body.title,
          ingredients: {
            create: req.body.ingredients,
          },
          directions: {
            create: req.body.directions,
          },
        },
      });

      return res.status(200).json(createRecipe);
    } catch (error) {
      return res.status(404).json({ message: 'Server error' });
    }
  } else {
    const data = await prisma.recipe.findMany();

    if (!data) {
      return res.status(404).json({ message: 'No recipes' });
    }

    return res.status(200).json(data);
  }
};
