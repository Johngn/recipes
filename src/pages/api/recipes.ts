import prisma from '../../db/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const createRecipe = await prisma.Recipe.create({
        data: {
          title: req.body.title,
          ingredients: {
            create: [{ name: 'Bread' }, { name: 'Milk' }],
          },
        },
      });

      return res.status(200).json(createRecipe);
    } catch (error) {
      return res.status(404).json({ message: 'Server error' });
    }
  } else {
    const data = await prisma.Recipe.findMany();

    if (!data) {
      return res.status(404).json({ message: 'No recipes' });
    }

    return res.status(200).json(data);
  }
};
