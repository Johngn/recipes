import HeadWrapper from "../layout/headWrapper";
import prisma from "../db/client";
import React, { FunctionComponent, useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { recipeType } from "../types/types";
import Image from "next/image";
import { categoryOptions, awsImageUrl } from "../../utils/constants";
import Nav from "../components/nav";

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await prisma.recipe.findMany();
  const recipes = data ? JSON.parse(JSON.stringify(data)) : []; // Need to do this because props need to be serializable

  return { props: { recipes } };
};

type HomeProps = {
  recipes: recipeType[];
};

const Home: FunctionComponent<HomeProps> = ({ recipes }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <HeadWrapper />
      <div className="min-h-screen bg-[url('/bg-green.png')] bg-no-repeat bg-fixed">
        <div className="pt-2 max-w-screen-xl h-auto pb-2 mx-auto ">
          <Nav />
          <section className="mt-10 sm:mt-20 mb-10 flex flex-col sm:flex-row items-center sm:items-end sm:justify-center animate-[appear2_1.3s_ease_1]">
            <div className="relative flex">
              <input
                type="text"
                placeholder="Search recipes"
                onChange={e => setSearchTerm(e.target.value)}
                className="w-64 border-b border-neutral-700 placeholder-neutral-700 bg-transparent"
              />
              <div className="w-5 h-5 absolute left-58">
                <Image width={20} height={20} src="/search-symbol.png" alt="" />
              </div>
            </div>
            <div className="mx-8 py-2 sm:py-0 text-2xl sm:text-7xl tracking-wider font-gothic text-neutral-700">
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
          </section>
          <section className="flex flex-wrap w-full justify-center">
            <button
              onClick={() => setSelectedCategory("")}
              className="ml-4 mb-1 tracking-widest border border-solid border-neutral-700 text-neutral-700 text-xs px-4 py-2 uppercase transition duration-300 hover:bg-[#a0c4ad] animate-[appear3_1.7s_ease_1] sm:px-6 sm:py-3 sm:text-base"
            >
              All
            </button>
            {categoryOptions.map((option, i) => (
              <button
                key={i}
                onClick={() => setSelectedCategory(option)}
                className="ml-4 mb-1 tracking-widest border border-solid border-neutral-700 text-neutral-700 text-xs px-4 py-2 uppercase transition duration-300 hover:bg-[#a0c4ad] animate-[appear3_1.7s_ease_1] sm:px-6 sm:py-3 sm:text-base"
              >
                {option}
              </button>
            ))}
          </section>
          <section className="w-full mt-10 flex flex-wrap p-4 justify-center animate-[appear4_2s_ease_1]">
            {recipes
              .filter(({ category }) =>
                selectedCategory ? selectedCategory === category : true
              )
              .filter(({ title }) =>
                title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(({ id, title, slug, image, category, intro }) => (
                <div key={id}>
                  <Link href={`/recipe/${slug}`}>
                    <div className="w-64 mx-3 mb-8 cursor-pointer">
                      <div className="flex justify-center items-center w-64 h-40 bg-neutral-400 text-white relative">
                        <div className="w-[260px] h-[162px] relative flex">
                          <img
                            style={{
                              cursor: "pointer",
                              objectFit: "cover",
                              width: "100%",
                            }}
                            src={`${awsImageUrl}/${image.toString()}`}
                            alt={title.toString()}
                          />
                        </div>
                      </div>
                      <h1 className="text-2xl overflow-hidden font-gothic capitalize text-justify text-neutral-700">
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
          </section>
        </div>
      </div>
    </>
  );
};

export default Home;
