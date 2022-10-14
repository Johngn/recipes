import Head from 'next/head';
import prisma from '../db/client';
import React, { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import Link, { LinkProps } from 'next/link';
import Navbar from '../layout/navbar';

export const getServerSideProps: GetServerSideProps = async context => {
  console.log('get-recipe', context);
  const data = await prisma.recipe.findMany();

  const recipes = data ? JSON.parse(JSON.stringify(data)) : [];
  // Pass data to the page via props
  return { props: { recipes } };
};

export type ingredientType = {
  id: number;
  name: String;
  unit: String;
  amount: number;
};

export type directionType = {
  order: number;
  text: string;
};

export type recipeType = {
  id: React.Key;
  title: String;
  directions: directionType[];
  ingredients: ingredientType[];
};

type HomeProps = {
  recipes: recipeType[];
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

      <Navbar />

      <div className="w-2/4 m-auto bg-slate-200 rounded-md mt-5 flex flex-col justify-center items-center">
        <Link href={`/add-recipe`}>
          <a>Add Recipe</a>
        </Link>
        {recipes.map(recipe => (
          <div key={recipe.id} className="max-w-2xl border">
            <div className="flex flex-row text-center w-full border">
              <h1 className="text-center text-xl p-2 m-0 text-blue-900">
                <Link href={`/recipe/${recipe.title}`}>
                  <a>{recipe.title}</a>
                </Link>
              </h1>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
