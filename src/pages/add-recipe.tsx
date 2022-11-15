import Router from "next/router";
import Link from "next/link";
import Image from "next/image";
import { FunctionComponent } from "react";
import EditRecipe from "../components/editRecipe";
import { recipeType } from "../types/types";

const AddRecipe: FunctionComponent = () => {
  const createRecipe = async (newRecipe: recipeType) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRecipe),
    }).then(() => {
      Router.push(`/recipe/${newRecipe.slug}`);
    });
  };

  return (
    <>
      <div className="max-w-screen-2xl mx-auto">
        <Link href={`/`}>
          <button className="w-64 mt-5 ml-5 items-center text-right text-neutral-800 flex border-b border-neutral-800 justify-between animate-[appear1_1s_ease_1]">
            <Image
              className=""
              width={72}
              height={10}
              src="/arrow-symbol.png"
              alt="arrow symbol"
            />
            <a>Back to all recipes</a>
          </button>
        </Link>
        <EditRecipe createRecipe={createRecipe} />
      </div>
    </>
  );
};

export default AddRecipe;
