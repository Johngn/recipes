import Head from 'next/head';
import React, { FunctionComponent } from 'react';
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next';
import Link, { LinkProps } from 'next/link';

export const getServerSideProps: GetServerSideProps = async context => {
  //Fetch data from external API
  const res = await fetch('http://localhost:3000/api/recipes');
  const recipes = await res.json();
  console.log('data', recipes);
  // Pass data to the page via props
  return { props: { recipes } };
};

type ingredientType = {
  id: number;
  name: String;
};

type directionType = {
  order: number;
  text: string;
};

type recipeType = {
  id: React.Key;
  title: String;
  directions: directionType[];
  ingredients: ingredientType[];
};

export type RecipeProps = {
  recipe: recipeType;
};

type HomeProps = {
  recipes: recipeType[];
};

const Recipe: FunctionComponent<RecipeProps> = ({ recipe }) => {
  if (!recipe) {
    return <div>...Loading</div>;
  }

  return (
    <div className="flex flex-row text-center w-full border">
      <h1 className="text-center text-xl p-2 m-0 text-blue-900">
        <Link href={`/recipe/${recipe.title}`}>
          <a>{recipe.title}</a>
        </Link>
      </h1>
    </div>
  );
};

const Home: FunctionComponent<HomeProps> = ({ recipes }) => {
  if (!recipes) {
    return <div>...Loading</div>;
  }

  return (
    <>
      <Head>
        <title>Recipe Builder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <Link href={`/add-recipe`}>
          <a>Add Recipe</a>
        </Link>
        {recipes.map(recipe => (
          <div key={recipe.id} className="max-w-2xl border">
            <Recipe recipe={recipe} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
