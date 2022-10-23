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
      <Navbar />

      <div className="w-2/4 m-auto bg-slate-200 rounded-md mt-5 flex flex-col justify-center items-center">
        {recipes.map(({ id, title, slug }) => (
          <div key={id} className="max-w-2xl border">
            <div className="flex flex-row text-center w-full border">
              <h1 className="text-center text-xl p-2 m-0 text-blue-900">
                <Link href={`/recipe/${slug}`}>
                  <a>{title}</a>
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
