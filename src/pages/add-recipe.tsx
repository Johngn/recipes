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
      <div className="">
        <button className="w-64 mt-5 ml-5 text-right text-neutral-800 flex border-b border-neutral-800 justify-between">
          <Image
            className="w-72 h-5"
            width={72}
            height={10}
            src="/arrow-symbol.png"
            alt=""
          />
          <Link href={`/`}>
            <a>Back to all recipes</a>
          </Link>
        </button>
        <input
          placeholder="Recipe name"
          className=""
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categoryOptions.map((selectOption) => (
            <option key={selectOption}>{selectOption}</option>
          ))}
        </select>

        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="">
          <div className="">
            <h2 className="">Ingredients</h2>
            {ingredients.map(({ name, amount, unit }, i) => (
              <div key={i} className="">
                <div className="">
                  <input
                    placeholder="Ingredient"
                    className=""
                    value={name}
                    name="name"
                    onChange={(e) => updateIngredientsArray(e, i)}
                  />
                  <input
                    placeholder="Amount"
                    className=""
                    type="number"
                    value={amount}
                    name="amount"
                    onChange={(e) => updateIngredientsArray(e, i)}
                  />
                  <input
                    placeholder="Unit"
                    className=""
                    value={unit}
                    name="unit"
                    onChange={(e) => updateIngredientsArray(e, i)}
                  />
                </div>
                <button onClick={() => onDeleteIngredient(i)} className="">
                  Delete
                </button>
              </div>
            ))}

            <button className="" onClick={onAddIngredient}>
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
                  onChange={(e) => updateDirectionsArray(e, i)}
                />
              </div>
            ))}

            <button className="" onClick={onAddDirection}>
              Add Direction
            </button>
          </div>
        </div>
        <div className="w-2/4 m-auto mt-10">
          <button className="" onClick={(e) => createRecipe(e)}>
            Add recipe
          </button>
        </div>
      </div>
    </>
  );
};

export default AddRecipe;
