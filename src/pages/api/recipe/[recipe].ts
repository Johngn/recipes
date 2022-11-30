/* eslint-disable import/no-anonymous-default-export */
import prisma from "../../../db/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PUT") {
    const recipeSlug = req.query["recipe"];

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
          image: req.body.image,
          intro: req.body.intro,
          category: req.body.category,
          tags: req.body.tags,
          ingredients: {
            // create again instead of update
            create: req.body.ingredients.map((ingredient: any) => ({
              name: ingredient.name,
              unit: ingredient.unit,
              amount: ingredient.amount,
            })),
          },
          directions: {
            // create again instead of update
            create: req.body.directions.map((direction: any) => ({
              order: direction.order,
              text: direction.text,
            })),
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

  if (req.method === "DELETE") {
    const recipeSlug = req.query["recipe"];

    if (!recipeSlug || typeof recipeSlug !== "string") {
      res.statusCode = 404;
      res.send(JSON.stringify({ message: "Not found" }));
      return;
    }

    try {
      const recipeToBeDeleted = await prisma.recipe.findFirst({
        where: {
          slug: recipeSlug,
        },
      });

      await prisma.recipe.delete({
        where: {
          id: recipeToBeDeleted.id,
        },
      });

      return res.status(200).json({ message: `Deleted ${recipeSlug}` });
    } catch (error) {
      return res.status(500).json({ message: `Server error` });
    }
  }
};
