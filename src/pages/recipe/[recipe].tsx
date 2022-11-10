import { FunctionComponent, useEffect, useState, useCallback } from "react";
import { GetServerSideProps } from "next";
import { recipeType, ingredientType, directionType } from "../../types/types";
import HeadWrapper from "../../layout/headWrapper";
import prisma from "../../db/client";
import slugify from "slugify";
import Router from "next/router";
import Image from "next/image";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { categoryOptions } from "../../../utils/constants";
import EditRecipe from "../../components/editRecipe";

const tags = [
  "Asian",
  "Spicy",
  "Fusion",
  "Quick dinner",
  "Vegetarian",
  "Healthy",
  "something1",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
];

export const getServerSideProps: GetServerSideProps = async context => {
  const recipeSlug = context.params["recipe"];

  if (!recipeSlug || typeof recipeSlug !== "string") return { notFound: true };

  const recipe = await prisma.recipe.findFirst({
    where: {
      slug: recipeSlug,
    },
  });

  const ingredients = await prisma.ingredient.findMany({
    where: {
      recipeId: recipe.id,
    },
  });

  const directions = await prisma.direction.findMany({
    where: {
      recipeId: recipe.id,
    },
  });

  return {
    props: {
      recipe: JSON.parse(JSON.stringify(recipe)),
      ingredientsOld: JSON.parse(JSON.stringify(ingredients)),
      directionsOld: JSON.parse(JSON.stringify(directions)),
    },
  };
};

type RecipeProps = {
  recipe: recipeType;
  ingredientsOld: ingredientType[];
  directionsOld: directionType[];
};

const Recipe: FunctionComponent<RecipeProps> = ({
  recipe,
  ingredientsOld,
  directionsOld,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(recipe.title.toString());
  const [ingredients, setIngredients] =
    useState<ingredientType[]>(ingredientsOld);
  const [directions, setDirections] = useState<directionType[]>(directionsOld);
  const [checkedState, setCheckedState] = useState(
    new Array(directions.length).fill(false)
  );
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const changeCheckbox = position => {
    const updatedCheckedState = checkedState.map((item, i) =>
      i === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  const updateRecipe = async (newRecipe: recipeType) => {
    // const newRecipe = {
    //   id: recipe.id,
    //   slug,
    //   title,
    //   description,
    //   ingredients: ingredients.map(ingredient => ({
    //     name: ingredient.name,
    //     amount: ingredient.amount,
    //     unit: ingredient.unit,
    //   })),
    //   directions: directions.map(direction => ({
    //     order: direction.order,
    //     text: direction.text,
    //   })),
    // };
    console.log(newRecipe);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipe/${recipe.slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRecipe),
    }).then(() => {
      setEditMode(false);
    });
  };

  return (
    <>
      <HeadWrapper />

      {!editMode ? (
        <div className="bg-[url('/bg-yellow.png')] bg-no-repeat bg-fixed">
          <div className="max-w-screen-2xl h-auto pb-20 mx-auto ">
            <Link href={`/`}>
              <button className="w-64 pt-5 ml-5 items-center text-right text-neutral-800 flex border-b border-neutral-800 justify-between animate-[appear1_1s_ease_1]">
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

            <div className="max-w-6xl w-10/12 mt-27 mb-60 mx-auto flex justify-between animate-[appear2_1.3s_ease_1]">
              <div className="relative w-[500px] h-[700px]">
                <Image
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              40%"
                  layout="fill"
                  src="/Lemon-polenta-ricotta-cake-01-1.jpg"
                  alt="food"
                />
              </div>

              <div className="w-1/2 h-[800px] ml-20 flex flex-col justify-between">
                <h2 className="tracking-widest uppercase">
                  {recipe?.category}
                </h2>
                <h1 className="mb-4 text-8xl font-gothic">{recipe?.title}</h1>
                <p className="mb-4 text-justify">{recipe?.intro}</p>
                <div className="flex justify-between font-bold flex-wrap">
                  {tags.map(tag => (
                    <div key={tag} className="mx-2">
                      {tag}
                    </div>
                  ))}
                </div>
                <button
                  className="w-32 px-6 py-3 text-xs tracking-widest border border-solid border-neutral-700 text-neutral-700 transition duration-300 hover:bg-neutral-200"
                  onClick={() => setEditMode(!editMode)}
                >
                  Edit recipe
                </button>
              </div>
            </div>

            <div className="max-w-6xl w-10/12 mt-20 p-10 mx-auto flex animate-[appear3_1.7s_ease_1] bg-white bg-opacity-70">
              <div className="w-1/3 border-r border-neutral-700 text-center">
                <div className="sticky top-8">
                  <h2 className="py-3 mb-10 text-xs text-left tracking-widest border-b border-neutral-700 text-neutral-700  uppercase">
                    Ingredients
                  </h2>

                  {ingredients?.map(({ name, amount, unit }, i) => (
                    <div key={i} className="mt-3 flex">
                      <h2 className="font-medium lowercase">
                        {amount + " " + unit}
                      </h2>
                      <h2 className="ml-2 lowercase text-left">{name}</h2>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-2/3">
                <h2 className="py-3 mb-10 text-xs tracking-widest border-b border-neutral-700 text-neutral-700  uppercase text-right">
                  Instructions
                </h2>
                {directions?.map(({ order, text }, i) => (
                  <div key={i} className="mt-3 flex">
                    <h2
                      className={
                        checkedState[i] ? "ml-8 text-neutral-300" : "ml-8"
                      }
                    >
                      {order}.
                    </h2>
                    <label
                      htmlFor={`custom-checkbox-${i}`}
                      className={
                        checkedState[i]
                          ? "instruction ml-3 text-justify w-[calc(100%-6rem)] text-neutral-300"
                          : "instruction ml-3 text-justify w-[calc(100%-6rem)]"
                      }
                    >
                      {text}
                    </label>
                    <input
                      className="ml-3 mt-1 w-5 h-5"
                      type="checkbox"
                      id={`custom-checkbox-${i}`}
                      name={text}
                      value={text}
                      checked={checkedState[i]}
                      onChange={() => changeCheckbox(i)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EditRecipe
          createRecipe={updateRecipe}
          recipe={recipe}
          ingredientsOld={ingredientsOld}
          directionsOld={directionsOld}
        />
      )}
    </>
  );
};

export default Recipe;
