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
  const [image, setImage] = useState("");

  const onDrop = useCallback(async acceptedFiles => {
    const file = acceptedFiles[0];
    const filename = encodeURIComponent(file.name);
    const res = await fetch(`/api/upload-url?file=${filename}`); // Get presigned URL
    const { url, fields } = await res.json();
    const formData = new FormData();

    Object.entries({ ...fields, file }).forEach(([key, value]: any[]) => {
      formData.append(key, value);
    });

    const upload = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (upload.ok) {
      console.log("Uploaded successfully!");
      setImage(filename);
    } else {
      console.error("Upload failed.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
        <>
          <div className="max-w-screen-2xl mx-auto">
            <Link href={`/`}>
              <button className="w-64 mt-5 ml-5 items-center text-right text-neutral-800 flex border-b border-neutral-800 justify-between animate-[appear1_1s_ease_1]">
                <Image
                  width={72}
                  height={10}
                  src="/arrow-symbol.png"
                  alt="arrow symbol"
                />
                <a>Back to all recipes</a>
              </button>
            </Link>
            <div className="max-w-6xl w-10/12 mt-27 mx-auto flex justify-between animate-[appear2_1.3s_ease_1]">
              <div>
                <input
                  placeholder="Enter recipe name"
                  className="w-80 border-b border-neutral-800 placeholder-neutral-500 font-gothic text-3xl text-neutral-700 transition duration-300 hover:bg-neutral-200 focus:bg-neutral-200"
                  value={title}
                  onChange={e => setTitle(e.currentTarget.value)}
                />
                <div>
                  <textarea
                    className="w-80 h-16 p-1 mt-4 bg-neutral-100 resize-none transition duration-300 hover:bg-neutral-200 focus:bg-neutral-200"
                    placeholder="Write a short description of your recipe here"
                    // value={description}
                    // onChange={e => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <select
                  className="appearance-none cursor-pointer w-80 border-b border-neutral-800 font-gothic text-3xl rounded-none transition duration-300 hover:bg-neutral-200 focus:bg-neutral-200"
                  // value={category}
                  // onChange={e => setCategory(e.target.value)}
                >
                  {/* {categoryOptions.map(selectOption => (
                    <option key={selectOption}>{selectOption}</option>
                  ))} */}
                </select>
                <div
                  {...getRootProps()}
                  className="w-80 h-16 p-1 mt-4 text-gray-400 bg-neutral-100 transition duration-300 hover:bg-neutral-200 cursor-pointer"
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop the file here</p>
                  ) : (
                    <p>Upload an image of your dish here</p>
                  )}
                </div>
              </div>
            </div>

            <div className="max-w-6xl w-10/12 mt-20 mx-auto flex animate-[appear3_1.7s_ease_1]">
              <div className="w-1/2 border-r border-neutral-700 text-center">
                <div className="sticky top-8">
                  <h2 className="py-3 text-xs text-left tracking-widest border-b border-neutral-700 text-neutral-700  uppercase">
                    Ingredients
                  </h2>
                  {ingredients.map(({ name, amount, unit }, i) => (
                    <div key={i} className="mt-3 flex items-start">
                      <input
                        className="w-[calc(100%-13rem)] p-1 bg-neutral-100 transition duration-300 hover:bg-neutral-200 focus:bg-neutral-200"
                        value={name}
                        name="name"
                        onChange={e => updateIngredientsArray(e, i)}
                      />
                      <input
                        placeholder="0"
                        className="w-14 p-1 ml-3 bg-neutral-100 transition duration-300 hover:bg-neutral-200 focus:bg-neutral-200"
                        type="number"
                        value={amount}
                        name="amount"
                        onChange={e => updateIngredientsArray(e, i)}
                      />
                      <input
                        placeholder="unit"
                        className="w-16 p-1 ml-3 bg-neutral-100 transition duration-300 hover:bg-neutral-200 focus:bg-neutral-200"
                        value={unit}
                        name="unit"
                        onChange={e => updateIngredientsArray(e, i)}
                      />
                      <button
                        onClick={() => onDeleteIngredient(i)}
                        className="ml-3 mr-8"
                      >
                        <Image
                          className="rotate-45"
                          width={20}
                          height={22}
                          src="/plus-symbol.png"
                          alt=""
                        />
                      </button>
                    </div>
                  ))}
                  <button
                    className="mt-10 px-6 py-3 text-xs tracking-widest border border-solid border-neutral-700 text-neutral-700 transition duration-300 hover:bg-neutral-200"
                    onClick={onAddIngredient}
                  >
                    New ingredient
                  </button>
                </div>
              </div>

              <div className="w-1/2 text-center">
                <h2 className="py-3 text-xs tracking-widest border-b border-neutral-700 text-neutral-700  uppercase text-right">
                  Instructions
                </h2>
                {directions.map(({ text }, i) => (
                  <div key={i} className="mt-3 flex items-start">
                    <h2 className="ml-8 w-4 text-neutral-700">{i + 1}.</h2>
                    <textarea
                      className="w-[calc(100%-5rem)] h-[7.5rem] ml-3 p-1 bg-neutral-100 resize-none transition duration-300 hover:bg-neutral-200 focus:bg-neutral-200"
                      value={text}
                      onChange={e => updateDirectionsArray(e, i)}
                    />
                    <button
                      onClick={() => onDeleteDirection(i)}
                      className="ml-3"
                    >
                      <Image
                        className="rotate-45"
                        width={20}
                        height={22}
                        src="/plus-symbol.png"
                        alt=""
                      />
                    </button>
                  </div>
                ))}
                <button
                  className="mt-10 px-6 py-3 text-xs tracking-widest border border-solid border-neutral-700 text-neutral-700 transition duration-300 hover:bg-neutral-200"
                  onClick={onAddDirection}
                >
                  New instruction
                </button>
              </div>
            </div>
            <div className="my-14 text-center animate-[appear3_1.7s_ease_1]">
              <button
                className="px-6 py-3 text-xs uppercase tracking-widest border border-solid border-neutral-700 text-white bg-neutral-700 transition-transform hover:scale-110 active:bg-neutral-500 active:translate-y-1"
                onClick={e => updateRecipe(e)}
              >
                Save recipe
              </button>
            </div>
          </div>
          JOHN JOHN JOHN JOHN JOHN JOHN JOHN JOHN JOHN JOHN JOHN JOHN JOHN JOHN
          JOHN JOHN JOHN JOHNJOHN JOHN JOHN JOHN JOHN JOHN JOHN JOHN JOHN JOHN
          JOHN JOHN JOHN JOHN JOHN JOHN JOHN JOHNJOHN JOHN JOHN JOHN JOHN JOHN
          JOHN JOHN JOHN JOHN JOHN JOHN JOHN JOHN JOHN JOHN JOHN JOHNJOHN JOHN
          JOHN JOHN JOHN JOHN JOHN JOHN JOHN JOHN JOHN JOHN JOHN JOHN JOHN JOHN
          JOHN JOHN
          <div className="flex mt-3 bg-slate-200 rounded-md w-full">
            <div className="m-10 mr-0 w-2/6">
              <h2 className="text-3xl font-bold mb-5">Ingredients</h2>
              {ingredients.map(({ name, amount, unit }, i) => (
                <div key={i} className="flex justify-between mb-2">
                  <div className="flex mb-2 k"></div>
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
        </>
      )}
    </>
  );
};

export default Recipe;
