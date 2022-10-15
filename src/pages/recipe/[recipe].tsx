import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import { recipeType, ingredientType, directionType } from '../../types/types';
import Navbar from '../../layout/navbar';
import HeadWrapper from '../../layout/headWrapper';

export const getServerSideProps: GetServerSideProps = async context => {
  const recipeSlug = context.params['recipe'];

  if (!recipeSlug || typeof recipeSlug !== 'string') return { notFound: true };

  const recipe = await prisma.recipe.findFirst({
    where: {
      slug: recipeSlug,
    },
  });

  const ingredients = await prisma.ingredient.findMany({
    where: {
      recipeId: recipe.id,
    },
  });

  const directions = await prisma.direction.findMany({
    where: {
      recipeId: recipe.id,
    },
  });

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
      <HeadWrapper />
      <Navbar />

      <div className="max-w-4xl m-auto mt-5 mb-5">
        <h1 className="text-6xl text-lime-700">{recipe.title}</h1>

        <div className="flex mt-3 bg-slate-200 rounded-md">
          <div className="p-10">
            <h2 className="text-3xl font-bold mb-5">Ingredients</h2>

            {ingredients?.map(({ name, amount, unit }) => (
              <div key={name} className="flex justify-between">
                <h2>{name}</h2>
                <div className="flex">
                  <h2>{amount + ' ' + unit}</h2>
                </div>
              </div>
            ))}
          </div>

          <div className="p-10 ">
            <h2 className="text-3xl font-bold mb-5 ">Directions</h2>
            {directions?.map(({ order, text }) => (
              <div key={order} className="mb-5">
                <h2 className="text-xl font-bold">Step {order}:</h2> {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Recipe;
