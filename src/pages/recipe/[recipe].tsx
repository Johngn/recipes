import { FunctionComponent, useState } from "react";
import { GetServerSideProps } from "next";
import { recipeType, ingredientType, directionType } from "../../types/types";
import HeadWrapper from "../../layout/headWrapper";
import prisma from "../../db/client";
import Router from "next/router";
import Image from "next/image";
import EditRecipe from "../../components/editRecipe";
import { awsImageUrl } from "../../../utils/constants";
import Nav from "../../components/nav";

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
  const [checkedState, setCheckedState] = useState(
    new Array(directionsOld.length).fill(false)
  );
  const [loading, setLoading] = useState(false);

  const changeCheckbox = position => {
    const updatedCheckedState = checkedState.map((item, i) =>
      i === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  const updateRecipe = async (newRecipe: recipeType) => {
    setLoading(true);
    newRecipe.id = recipe.id;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipe/${recipe.slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRecipe),
    }).then(() => {
      setLoading(false);
      setEditMode(false);
      Router.push(`/recipe/${newRecipe.slug}`);
    });
  };

  const deleteRecipe = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipe/${recipe.slug}`, {
      method: "DELETE",
    }).then(() => {
      Router.push(`/`);
    });
  };

  return (
    <>
      <HeadWrapper />

      {!editMode ? (
        <div className="min-h-screen bg-[url('/bg-yellow.png')] bg-no-repeat bg-fixed">
          <div className="pt-2 max-w-screen-xl h-auto pb-10 mx-auto ">
            <Nav />
            <section className="w-11/12 md:min-h-[500px] lg:min-h-[600px] mt-10 mb-20 mx-auto flex flex-col md:flex-row justify-between animate-[appear2_1.3s_ease_1]">
              <div className="relative w-full h-[200px] md:h-auto md:w-5/12">
                <Image
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              40%"
                  layout="fill"
                  src={`${awsImageUrl}/${recipe.image}`}
                  alt="food"
                />
              </div>
              <div className="w-full mt-10 md:mt-0 md:w-7/12 md:ml-20 flex flex-col">
                <h2 className="mb-2 tracking-widest uppercase">
                  {recipe?.category}
                </h2>
                <h1 className="mb-12 text-5xl md:text-6xl lg:text-8xl font-gothic">
                  {recipe?.title}
                </h1>
                <p className="mb-4 text-justify">{recipe?.intro}</p>
                <div className="mb-8 flex font-bold flex-wrap">
                  {recipe.tags.map((tag, i) => (
                    <p key={i} className="mr-2">
                      {tag}
                    </p>
                  ))}
                </div>
                <button
                  className="w-32 px-6 py-3 text-xs tracking-widest border border-solid border-neutral-700 text-neutral-700 transition duration-300 hover:bg-[#f2d3ae]"
                  onClick={() => setEditMode(!editMode)}
                >
                  Edit recipe
                </button>
              </div>
            </section>
            <section className="w-11/12 mt-20 p-2 pb-10 sm:p-10 mx-auto flex flex-col sm:flex-row animate-[appear3_1.7s_ease_1] bg-white bg-opacity-70">
              <div className="w-full sm:w-1/3 sm:border-r border-neutral-700 text-center">
                <div className="sticky top-8">
                  <h2 className="py-3 mb-10 text-xs text-left tracking-widest border-b border-neutral-700 text-neutral-700  uppercase">
                    Ingredients
                  </h2>
                  {ingredientsOld?.map(({ name, amount, unit }, i) => (
                    <div key={i} className="mt-3 flex">
                      <h2 className="lowercase">{amount + " " + unit}</h2>
                      <h2 className="ml-2 lowercase text-left">{name}</h2>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full sm:w-2/3">
                <h2 className="py-3 mb-10 text-xs tracking-widest border-b border-neutral-700 text-neutral-700  uppercase text-right">
                  Instructions
                </h2>
                {directionsOld?.map(({ order, text }, i) => (
                  <div key={i} className="mt-3 flex">
                    <h2
                      className={
                        checkedState[i] ? "sm:ml-8 text-neutral-300" : "sm:ml-8"
                      }
                    >
                      {order}.
                    </h2>
                    <label
                      htmlFor={`custom-checkbox-${i}`}
                      className={
                        checkedState[i]
                          ? "instruction ml-3 text-justify sm:w-[calc(100%-6rem)] text-neutral-300"
                          : "instruction ml-3 text-justify sm:w-[calc(100%-6rem)]"
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
            </section>
          </div>
          <button onClick={deleteRecipe}>Delete</button>
        </div>
      ) : (
        <EditRecipe
          createRecipe={updateRecipe}
          recipe={recipe}
          ingredientsOld={ingredientsOld}
          directionsOld={directionsOld}
          loading={loading}
        />
      )}
    </>
  );
};

export default Recipe;
