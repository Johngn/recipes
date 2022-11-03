import { FunctionComponent, useState } from "react";
import Router from "next/router";
import { ingredientType, directionType } from "../types/types";
import slugify from "slugify";
import { categoryOptions } from "../../utils/constants";
import Link from "next/link";
import Image from "next/image";

const AddRecipe: FunctionComponent = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Breakfast");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<ingredientType[]>([
    { name: "", amount: 0, unit: "" },
  ]);
  const [directions, setDirections] = useState<directionType[]>([
    { order: 1, text: "" },
  ]);

  const createRecipe = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (title !== "" && ingredients.length > 0 && directions.length > 0) {
      const slug = slugify(title, { lower: true });

      const newRecipe = {
        slug,
        title,
        ingredients,
        directions,
        category,
        image:
          "https://www.pixelstalk.net/wp-content/uploads/2016/08/Fast-food-backgrounds-free-download.jpg",
        intro: description,
      };

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecipe),
      }).then(() => {
        Router.push(`/recipe/${slug}`);
      });
    }
  };

  const onAddIngredient = () => {
    setIngredients((prevState) => [
      ...prevState,
      {
        name: "",
        amount: 0,
        unit: "",
      },
    ]);
  };

  const onAddDirection = () => {
    setDirections((prevState) => [
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
      <div className="max-w-screen-2xl mx-auto">
        <Link href={`/`}>
          <button className="w-64 mt-5 ml-5 text-right text-neutral-800 flex border-b border-neutral-800 justify-between">
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
        <div className="max-w-6xl w-10/12 mt-27 mx-auto flex justify-between">
          <div>
            <input
              placeholder="Recipe name"
              className="w-80 border-b border-neutral-800 placeholder-neutral-800 font-gothic text-3xl text-neutral-800"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
            <div>
              <textarea
                className="w-80 h-16 p-1 mt-4 bg-neutral-100 resize-none"
                placeholder="Write a short description of your recipe here"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 text-right">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categoryOptions.map((selectOption) => (
                <option key={selectOption}>{selectOption}</option>
              ))}
            </select>
            <div className="w-80 h-16 p-1 mt-4 bg-neutral-100"></div>
          </div>
        </div>

        <div className="max-w-6xl w-10/12 mt-20 mx-auto flex">
          <div className="w-1/2 border-r border-neutral-700 text-center">
            <h2 className="py-3 text-xs text-left tracking-widest border-b border-neutral-700 text-neutral-700  uppercase">
              Ingredients
            </h2>
            {ingredients.map(({ name, amount, unit }, i) => (
              <div key={i}>
                <div className="mt-3 flex items-start">
                  <input
                    className="w-[calc(100%-13rem)] p-1 bg-neutral-100"
                    value={name}
                    name="name"
                    onChange={(e) => updateIngredientsArray(e, i)}
                  />
                  <input
                    placeholder="0"
                    className="w-14 p-1 ml-3 bg-neutral-100"
                    type="number"
                    value={amount}
                    name="amount"
                    onChange={(e) => updateIngredientsArray(e, i)}
                  />
                  <input
                    placeholder="unit"
                    className="w-16 p-1 ml-3 bg-neutral-100"
                    value={unit}
                    name="unit"
                    onChange={(e) => updateIngredientsArray(e, i)}
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
              </div>
            ))}
            <button
              className="mt-10 px-6 py-3 text-xs tracking-widest border border-solid border-neutral-700 text-neutral-700"
              onClick={onAddIngredient}
            >
              New Ingredient
            </button>
          </div>

          <div className="w-1/2 text-center">
            <h2 className="py-3 text-xs tracking-widest border-b border-neutral-700 text-neutral-700  uppercase text-right">
              Instructions
            </h2>
            {directions.map(({ text }, i) => (
              <div key={i} className="mt-3 flex items-start">
                <div className="ml-8">
                  <h2 className="text-neutral-700">{i + 1}.</h2>
                </div>
                <textarea
                  className="w-[calc(100%-5rem)] h-[7.5rem] ml-3 p-1 bg-neutral-100 resize-none"
                  value={text}
                  onChange={(e) => updateDirectionsArray(e, i)}
                />
                <button onClick={() => onDeleteDirection(i)} className="ml-3">
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
              className="mt-10 px-6 py-3 text-xs tracking-widest border border-solid border-neutral-700 text-neutral-700"
              onClick={onAddDirection}
            >
              New Instruction
            </button>
          </div>
        </div>
        <div className="">
          <button className="" onClick={(e) => createRecipe(e)}>
            Add recipe
          </button>
        </div>
      </div>
    </>
  );
};

export default AddRecipe;
