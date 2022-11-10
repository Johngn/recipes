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

  return (
    <>
      <HeadWrapper />
      <div className="mt-32 mb-24 flex items-end justify-center animate-[appear2_1.3s_ease_1]">
        <div className="relative flex">
          <input
            type="text"
            placeholder="Search recipes"
            onChange={e => setSearchTerm(e.target.value)}
            className="w-64 border-b border-neutral-700 placeholder-neutral-700"
          />
          <div className="w-5 h-5 absolute left-58">
            <Image width={20} height={20} src="/search-symbol.png" alt="" />
          </div>
        </div>
        <div className="mx-8 text-7xl tracking-wider font-gothic text-neutral-700">
          OR
        </div>
        <Link href={`/add-recipe`}>
          <button className="w-64 text-right flex border-b text-neutral-700 border-neutral-700 justify-between">
            <Image
              className="w-5 h-5"
              width={20}
              height={20}
              src="/plus-symbol.png"
              alt="plus symbol"
            />
            <a>Add new recipe</a>
          </button>
        </Link>
      </div>
      <div className="flex flex-wrap w-full justify-center">
        <button
          onClick={() => setSelectedCategory("")}
          className="ml-4 mb-1 tracking-widest border border-solid border-neutral-700 text-neutral-700 px-6 py-3 uppercase transition duration-300 hover:bg-neutral-200 animate-[appear3_1.7s_ease_1]"
        >
          All
        </button>
        {categoryOptions.map((option, i) => (
          <button
            key={i}
            onClick={() => setSelectedCategory(option)}
            className="ml-4 mb-1 tracking-widest border border-solid border-neutral-700 text-neutral-700 px-6 py-3 uppercase transition duration-300 hover:bg-neutral-200 animate-[appear3_1.7s_ease_1]"
          >
            {option}
          </button>
        ))}
      </div>

      <div className="w-screen mt-10 flex flex-wrap p-4 justify-center animate-[appear4_2s_ease_1]">
        {recipes
          .filter(({ category }) =>
            selectedCategory ? selectedCategory === category : true
          )
          .filter(({ title }) => title.includes(searchTerm))
          .map(({ id, title, slug, image, category, intro }) => (
            <div key={id}>
              <Link href={`/recipe/${slug}`}>
                <div className="w-64 mx-3 mb-8 cursor-pointer">
                  <div className="flex justify-center items-center w-64 h-40 bg-neutral-400 text-white relative">
                    <Image
                      style={{ cursor: "pointer" }}
                      src={`${awsImageUrl}/${image.toString()}`}
                      alt={title.toString()}
                      width={260}
                      height={162}
                    />

                    <div className="absolute">
                      <p className="font-gothic text-4xl text-neutral-700 text-center">
                        {category.slice(0, 1)}
                        <span className="underline decoration-1 underline-offset-8">
                          {category.slice(1)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <h1 className="h-16 text-2xl overflow-hidden font-gothic capitalize text-justify text-neutral-700">
                    <Link href={`/recipe/${slug}`}>
                      <a>{title}</a>
                    </Link>
                  </h1>
                  <p className="w-64 h-24 text-ellipsis overflow-hidden text-justify text-neutral-700">
                    {intro}
                  </p>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </>
  );
};

export default Home;
