import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import { recipeType, ingredientType, directionType } from '../index';
import Navbar from '../../layout/navbar';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async context => {
  const recipeTitle = context.query.recipe;

  if (!recipeTitle || typeof recipeTitle !== 'string')
    return { notFound: true };

  const recipe = await prisma.recipe.findFirst({
    where: {
      title: recipeTitle,
    },
  });

  const ingredients = await prisma.recipe
    .findFirst({
      where: {
        title: recipeTitle,
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

  // if (!recipe) return { notFound: true };

  return {
    props: {
      recipe: JSON.parse(JSON.stringify(recipe)),
      ingredients: JSON.parse(JSON.stringify(ingredients)),
      directions: JSON.parse(JSON.stringify(directions)),
    },
  };
};

type RecipeProps = {
  recipe: recipeType;
  ingredients: ingredientType[];
  directions: directionType[];
};

const Recipe: FunctionComponent<RecipeProps> = ({
  recipe,
  ingredients,
  directions,
}) => {
  return (
    <>
      <Head>
        <title>Recipe Builder</title>
        <link rel="icon" href="/fork.png" />
      </Head>

      <Navbar />

      <div className="w-2/4 m-auto mt-5">
        <h1 className="text-8xl text-lime-700">{recipe.title}</h1>

        <div className="flex mt-3 bg-slate-200 rounded-md">
          <div className="p-10">
            <h2 className="text-3xl font-bold mb-5">Ingredients</h2>

            {ingredients?.map(ingredient => (
              <div key={ingredient.id} className="flex justify-between">
                <h2>{ingredient.name}</h2>
                <div className="flex">
                  <h2>{ingredient.amount + ' ' + ingredient.unit}</h2>
                </div>
              </div>
            ))}
          </div>

          <div className="p-10 ">
            <h2 className="text-3xl font-bold mb-5 ">Directions</h2>
            {directions?.map(direction => (
              <div key={direction.order} className="mb-5">
                <h2 className="text-xl font-bold">Step {direction.order}:</h2>{' '}
                {direction.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Recipe;
