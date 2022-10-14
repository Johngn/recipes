import prisma from '../../db/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    createRecipe(req, res);
  } else {
    getAllRecipes(req, res);
  }
};

const getAllRecipes = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = await prisma.recipe.findMany();

  if (!data) {
    return res.status(404).json({ message: 'No recipes' });
  }

  return res.status(200).json(data);
};

const createRecipe = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const createReciped = await prisma.recipe.create({
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

    return res.status(200).json(createReciped);
  } catch (error) {
    return res.status(404).json({ message: 'Server error' });
  }
};
