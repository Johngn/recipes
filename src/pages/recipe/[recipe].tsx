import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import { recipeType, ingredientType, directionType } from '../index';

export const getServerSideProps: GetServerSideProps = async context => {
  const recipeTitle = context.query.recipe;

  const res = await fetch(`http://localhost:3000/api/recipe/${recipeTitle}`);
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
    <div className="p-10 w-2/4 m-auto bg-slate-200">
      <h1 className="text-8xl text-lime-700">{recipe.title}</h1>

      <div className="flex">
        <div className="p-10 m-10 bg-slate-700 border">
          <h2 className="text-2xl mb-2">Ingredients:</h2>

          {ingredients?.map(ingredient => (
            <div className="flex justify-between">
              <h2>{ingredient.name}</h2>
              <div className="flex">
                <h2>{ingredient.amount}</h2>
                <h2>{ingredient.unit}</h2>
              </div>
            </div>
          ))}
        </div>

        <div className="p-10 border">
          {directions?.map(direction => (
            <>
              <h2>
                Step {direction.order}: {direction.text}
              </h2>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recipe;
