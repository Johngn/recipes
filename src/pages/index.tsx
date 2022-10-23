import HeadWrapper from "../layout/headWrapper";
import prisma from "../db/client";
import React, { FunctionComponent } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import Navbar from "../layout/navbar";
import { recipeType } from "../types/types";

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await prisma.recipe.findMany();

  const recipes = data ? JSON.parse(JSON.stringify(data)) : []; // Need to do this because props need to be serializable

  return { props: { recipes } };
};

type HomeProps = {
  recipes: recipeType[];
};

const Home: FunctionComponent<HomeProps> = ({ recipes }) => {
  return (
    <>
      <HeadWrapper />
      {/* <Navbar /> */}
      <div className="w-160 mx-auto my-16 flex items-end">
        <input type="text" placeholder="Search recipes" className="w-64" />
        <div className="w-32 text-8xl tracking-wider font-gothic text-neutral-800">
          OR
        </div>
        <button className="w-64 text-right">Add new recipe</button>
      </div>
      <div>
        {recipes.map(({ id, title, slug }) => (
          <div key={id}>
            <h1 className="">
              <Link href={`/recipe/${slug}`}>
                <a>{title}</a>
              </Link>
            </h1>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
