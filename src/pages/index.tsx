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
      <div className="w-160 mx-auto mt-16 mb-40 flex items-end">
        <div className="relative flex">
          <input
            type="text"
            placeholder="Search recipes"
            className="w-64 border-b border-neutral-800"
          />
          <img className="w-5 h-5 absolute left-58" src="/search-symbol.png" />
        </div>
        <div className="w-32 text-8xl tracking-wider font-gothic text-neutral-800">
          OR
        </div>
        <button className="w-64 text-right flex border-b border-neutral-800 justify-between">
          <img className="w-5 h-5" src="/plus-symbol.png" />
          Add new recipe
        </button>
      </div>
      <div className="flex ml-3">
        <div className="ml-4 tracking-widest border border-solid border-neutral-700 text-neutral-700 px-6 py-3">
          ALL
        </div>
        <div className="ml-4 tracking-widest border border-solid border-neutral-700 text-neutral-700 px-6 py-3">
          BREAKFASTS
        </div>
        <div className="ml-4 tracking-widest border border-solid border-neutral-700 text-neutral-700 px-6 py-3">
          SNACKS
        </div>
        <div className="ml-4 tracking-widest border border-solid border-neutral-700 text-neutral-700 px-6 py-3">
          LUNCHES
        </div>
        <div className="ml-4 tracking-widest border border-solid border-neutral-700 text-neutral-700 px-6 py-3">
          MAINS
        </div>
        <div className="ml-4 tracking-widest border border-solid border-neutral-700 text-neutral-700 px-6 py-3">
          SIDES
        </div>
      </div>

      <div className="w-screen mt-10 flex flex-wrap p-4 justify-center">
        {recipes.map(({ id, title, slug }) => (
          <div key={id} className="w-64 mx-3 mb-8">
            <div className="flex justify-center items-center w-64 h-40 bg-neutral-400 text-white">
              <p className="font-gothic text-4xl text-center">
                M
                <span className="underline decoration-1 underline-offset-8">
                  ain
                </span>
              </p>
            </div>
            <h1 className="h-16 text-2xl overflow-hidden font-gothic capitalize text-justify text-neutral-800">
              <Link href={`/recipe/${slug}`}>
                <a>{title}</a>
              </Link>
            </h1>
            <p className="w-64 h-36 text-ellipsis overflow-hidden text-justify text-neutral-800">
              Here is a great weeknight dinner that comes together on the stove
              in just under 20 minutes. Soft, sticky and flavor-packed aubergine
              meets crunchy broccoli and earthy noodles. This truly tastes like
              heaven in a bowl.
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
