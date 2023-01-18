/* eslint-disable import/no-anonymous-default-export */
import prisma from "../../db/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    createRecipe(req, res);
  }
};

const createRecipe = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const createdRecipe = await prisma.recipe.create({
      data: {
        title: req.body.title,
        slug: req.body.slug,
        ingredients: {
          create: req.body.ingredients,
        },
        directions: {
          create: req.body.directions,
        },
        tags: req.body.tags,
        intro: req.body.intro,
        image: req.body.image,
        category: req.body.category,
      },
    });

    return res.status(200).json(createdRecipe);
  } catch (error) {
    return res.status(404).json({ message: "Server error" });
  }
};
