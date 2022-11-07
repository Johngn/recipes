import HeadWrapper from "../layout/headWrapper";
import prisma from "../db/client";
import React, { FunctionComponent, useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { recipeType } from "../types/types";
import Image from "next/image";
import { categoryOptions } from "../../utils/constants";

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await prisma.recipe.findMany();

  const recipes = data ? JSON.parse(JSON.stringify(data)) : []; // Need to do this because props need to be serializable
  // const recipes = [];
  return { props: { recipes } };
};

type HomeProps = {
  recipes: recipeType[];
};

const Home: FunctionComponent<HomeProps> = ({ recipes }) => {
  const awsImageUrl =
    "https://recipe-builder-pictures.s3.eu-west-1.amazonaws.com";
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  console.log(process.env.NEXT_PUBLIC_DATABASE_URL);
  return (
    <>
      <HeadWrapper />
      {/* <Navbar /> */}
      <div className="mt-32 mb-24 flex items-end justify-center">
        <div className="relative flex">
          <input
            type="text"
            placeholder="Search recipes"
            onChange={e => setSearchTerm(e.target.value)}
            className="w-64 border-b border-neutral-800 placeholder-neutral-800"
          />
          <div className="w-5 h-5 absolute left-58">
            <Image width={20} height={20} src="/search-symbol.png" alt="" />
          </div>
        </div>
        <div className="mx-8 text-7xl tracking-wider font-gothic text-neutral-800">
          OR
        </div>
        <Link href={`/add-recipe`}>
          <button className="w-64 text-right flex border-b text-neutral-800 border-neutral-800 justify-between">
            <Image
              className="w-5 h-5"
              width={20}
              height={20}
              src="/plus-symbol.png"
              alt=""
            />
            <a>Add new recipe</a>
          </button>
        </Link>
      </div>
      <div className="flex flex-wrap ml-3 w-full justify-center">
        <button
          onClick={() => setSelectedCategory("")}
          className="ml-4 mb-1 tracking-widest border border-solid border-neutral-700 text-neutral-700 px-6 py-3"
        >
          ALL
        </button>
        {categoryOptions.map((option, i) => (
          <button
            key={i}
            onClick={() => setSelectedCategory(option)}
            className="ml-4 mb-1 tracking-widest border border-solid border-neutral-700 text-neutral-700 px-6 py-3 uppercase"
          >
            {option}
          </button>
        ))}
      </div>

      <div className="w-screen mt-10 flex flex-wrap p-4 justify-center">
        {recipes
          .filter(({ category }) =>
            selectedCategory ? selectedCategory === category : true
          )
          .filter(({ title }) => title.includes(searchTerm))
          .map(({ id, title, slug, image, category, intro }) => (
            <div key={id} className="w-64 mx-3 mb-8">
              <div className="flex justify-center items-center w-64 h-40 bg-neutral-400 text-white relative">
                <Link href={`/recipe/${slug}`}>
                  <Image
                    style={{ cursor: "pointer" }}
                    src={`${awsImageUrl}/${image.toString()}`}
                    alt={title.toString()}
                    width={260}
                    height={162}
                  />
                </Link>
                <div className="absolute">
                  <p className="font-gothic text-4xl text-neutral-800 text-center">
                    {category.slice(0, 1)}
                    <span className="underline decoration-1 underline-offset-8">
                      {category.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
              <h1 className="h-16 text-2xl overflow-hidden font-gothic capitalize text-justify text-neutral-800">
                <Link href={`/recipe/${slug}`}>
                  <a>{title}</a>
                </Link>
              </h1>
              <p className="w-64 h-24 text-ellipsis overflow-hidden text-justify text-neutral-800">
                {intro}
              </p>
            </div>
          ))}
      </div>
    </>
  );
};

export default Home;
