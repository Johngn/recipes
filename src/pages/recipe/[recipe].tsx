import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import { RecipeProps } from '..';

export const getServerSideProps: GetServerSideProps = async context => {
  const recipeTitle = context.query.recipe;
  //Fetch data from external API
  const res = await fetch(`http://localhost:3000/api/recipe/${recipeTitle}`);
  const recipe = await res.json();
  console.log('recipe', recipe);
  // Pass recipe to the page via props
  return { props: { recipe: recipe } };
};

const Recipe: FunctionComponent<RecipeProps> = ({ recipe }) => {
  if (!recipe) {
    return <div>...loading</div>;
  }

  if (recipe.ingredients.length < 0) {
    return <div>...loading</div>;
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <h1 className="text-lg text-lime-700">Title: {recipe.title}</h1>
      {recipe.ingredients?.map(ingredient => (
        <>
          <h2>Ingredients: {ingredient.name}</h2>
        </>
      ))}
    </div>
  );
};

export default Recipe;
