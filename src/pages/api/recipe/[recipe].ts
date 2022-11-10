/* eslint-disable import/no-anonymous-default-export */
import prisma from "../../../db/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PUT") {
    const recipeSlug = req.query["recipe"];
    console.log(req.body);

    if (!recipeSlug || typeof recipeSlug !== "string") {
      res.statusCode = 404;
      res.send(JSON.stringify({ message: "Not found" }));
      return;
    }

    // delete old ingredients first - not ideal
    await prisma.ingredient.deleteMany({
      where: {
        recipeId: {
          equals: req.body.id,
        },
      },
    });

    // same for directions
    await prisma.direction.deleteMany({
      where: {
        recipeId: {
          equals: req.body.id,
        },
      },
    });

    try {
      const recipe = await prisma.recipe.update({
        where: {
          id: req.body.id,
        },
        data: {
          title: req.body.title,
          slug: req.body.slug,
          ingredients: {
            create: req.body.ingredients, // create again instead of update
          },
          directions: {
            create: req.body.directions, // create again instead of update
          },
        },
      });

      if (!recipe) {
        res.statusCode = 404;
        res.send(JSON.stringify({ message: "Recipe not found" }));
        return;
      }

      return res.json({ recipe });
    } catch (error) {
      return res.status(500).json({ message: "Failed" });
    }
  }
};
