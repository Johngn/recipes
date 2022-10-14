import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import { recipeType, ingredientType, directionType } from '../index';
import Navbar from '../../layout/navbar';

export const getServerSideProps: GetServerSideProps = async context => {
  const recipeTitle = context.query.recipe;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/recipe/${recipeTitle}`
  );
  const data = await res.json();

  return {
    props: {
      recipe: data.recipe,
      ingredients: data.ingredients,
      directions: data.directions,
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
