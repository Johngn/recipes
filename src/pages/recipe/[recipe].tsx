import { FunctionComponent, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { recipeType, ingredientType, directionType } from "../../types/types";
import HeadWrapper from "../../layout/headWrapper";
import prisma from "../../db/client";
import slugify from "slugify";
import Router from "next/router";
import Image from "next/image";

const tags = [
  "Asian",
  "Spicy",
  "Fusion",
  "Quick dinner",
  "Vegetarian",
  "Healthy",
];

const buttonClasses =
  "inline-block px-6 py-2.5 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out w-full";

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

  const changeCheckbox = position => {
    const updatedCheckedState = checkedState.map((item, i) =>
      i === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  const updateRecipe = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (title !== "" && ingredients.length > 0 && directions.length > 0) {
      const slug = slugify(title, { lower: true });

      const newRecipe = {
        id: recipe.id,
        slug,
        title,
        ingredients: ingredients.map(ingredient => ({
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
        })),
        directions: directions.map(direction => ({
          order: direction.order,
          text: direction.text,
        })),
      };

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipe/${recipe.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecipe),
      }).then(() => {
        setEditMode(false);
      });
    }
  };

  const onAddIngredient = () => {
    setIngredients(prevState => [
      ...prevState,
      {
        name: "",
        amount: 0,
        unit: "",
      },
    ]);
  };

  const onAddDirection = () => {
    setDirections(prevState => [
      ...prevState,
      { order: directions.length + 1, text: "" },
    ]);
  };

  const onDeleteIngredient = (i: number) => {
    ingredients.splice(i, 1);
    setIngredients([...ingredients]);
  };

  const onDeleteDirection = (i: number) => {
    directions.splice(i, 1);

    const updatedDirections = directions.map((direction, i) => {
      return {
        ...direction,
        order: i + 1,
      };
    });

    setDirections(updatedDirections);
  };

  const updateIngredientsArray = (e: any, i: number) => {
    setIngredients(
      ingredients.map((ingredient, j) => {
        if (i === j) {
          return (ingredient = {
            ...ingredient,
            [e.currentTarget.name]:
              e.currentTarget.name === "amount"
                ? parseFloat(e.currentTarget.value)
                : e.currentTarget.value,
          });
        } else {
          return ingredient;
        }
      })
    );
  };

  const updateDirectionsArray = (e: any, i: number) => {
    setDirections(
      directions.map((direction, j) => {
        if (i === j) {
          return (direction = {
            ...direction,
            text: e.currentTarget.value,
          });
        } else {
          return direction;
        }
      })
    );
  };

  return (
    <>
      <HeadWrapper />

      {!editMode ? (
        <>
          <div className="max-w-screen-2xl mx-auto mb-20">
            <button className="w-64 mt-5 ml-5 items-center text-right text-neutral-800 flex border-b border-neutral-800 justify-between animate-[appear1_1s_ease_1]">
              <Image
                className=""
                width={72}
                height={10}
                src=""
                alt="arrow symbol"
              />
              <a>Back to all recipes</a>
            </button>

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

              <div className="w-1/2 ml-20 flex flex-col justify-between">
                <h2 className="mb-4 tracking-widest uppercase">
                  {recipe?.category}
                </h2>
                <h1 className="mb-10 text-8xl font-gothic">{recipe?.title}</h1>
                <p className="mb-4 text-justify">{recipe?.intro}</p>
                <div className="flex justify-between font-bold">
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

            <div className="max-w-6xl w-10/12 mt-20 mx-auto flex animate-[appear3_1.7s_ease_1]">
              <div className="w-1/3 border-r border-neutral-700 text-center">
                <div className="sticky top-8">
                  <h2 className="py-3 text-xs text-left tracking-widest border-b border-neutral-700 text-neutral-700  uppercase">
                    Ingredients
                  </h2>

                  {ingredients?.map(({ name, amount, unit }, i) => (
                    <div key={i} className="mt-3 flex">
                      <h2 className="font-medium lowercase">
                        {amount + " " + unit}
                      </h2>
                      <h2 className="ml-2 lowercase">{name}</h2>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-2/3">
                <h2 className="py-3 text-xs tracking-widest border-b border-neutral-700 text-neutral-700  uppercase text-right">
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
        </>
      ) : (
        <div className="max-w-3xl m-auto mt-5">
          <div className="w-full flex">
            <input
              placeholder="Recipe name"
              className="text-6xl w-full"
              value={title}
              onChange={e => setTitle(e.currentTarget.value)}
            />
          </div>

          <div className="flex mt-3 bg-slate-200 rounded-md w-full">
            <div className="m-10 mr-0 w-2/6">
              <h2 className="text-3xl font-bold mb-5">Ingredients</h2>
              {ingredients.map(({ name, amount, unit }, i) => (
                <div key={i} className="flex justify-between mb-2">
                  <div className="flex mb-2 k">
                    <input
                      placeholder="Ingredient"
                      className="mr-2 w-32"
                      value={name}
                      name="name"
                      onChange={e => updateIngredientsArray(e, i)}
                    />
                    <input
                      placeholder="Amount"
                      className="mr-2 w-10"
                      type="number"
                      value={amount}
                      name="amount"
                      onChange={e => updateIngredientsArray(e, i)}
                    />
                    <input
                      placeholder="Unit"
                      className="w-10"
                      value={unit}
                      name="unit"
                      onChange={e => updateIngredientsArray(e, i)}
                    />
                  </div>
                  <button
                    onClick={() => onDeleteIngredient(i)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}

              <button className={buttonClasses} onClick={onAddIngredient}>
                Add Ingredient
              </button>
            </div>

            <div className="m-10 w-4/6">
              <h2 className="text-3xl font-bold mb-5">Directions</h2>

              {directions.map(({ text }, i) => (
                <div key={i} className="mb-5">
                  <div className="flex justify-between w-full">
                    <h2 className="text-xl font-bold">Step {i + 1}:</h2>
                    <button
                      onClick={() => onDeleteDirection(i)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                  <textarea
                    className="w-full"
                    value={text}
                    onChange={e => updateDirectionsArray(e, i)}
                  />
                </div>
              ))}

              <button className={buttonClasses} onClick={onAddDirection}>
                Add Direction
              </button>
            </div>
          </div>
          <div className="w-2/4 m-auto mt-10">
            <button className={buttonClasses} onClick={e => updateRecipe(e)}>
              Update recipe
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Recipe;
