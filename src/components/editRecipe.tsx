import { ingredientType, directionType, recipeType } from "../types/types";
import slugify from "slugify";
import { categoryOptions } from "../../utils/constants";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { FunctionComponent, useState, useCallback } from "react";

type EditProps = {
  createRecipe?: (newRecipe: recipeType) => Promise<void>;
  recipe?: recipeType;
  ingredientsOld?: ingredientType[];
  directionsOld?: directionType[];
};

const EditRecipe: FunctionComponent<EditProps> = ({
  createRecipe,
  recipe,
  ingredientsOld,
  directionsOld,
}) => {
  // console.log({ recipe, ingredientsOld, directionsOld });
  const [title, setTitle] = useState(
    recipe.title ? recipe.title.toString() : ""
  );
  const [category, setCategory] = useState(
    recipe.category ? recipe.category.toString() : ""
  );
  const [description, setDescription] = useState(
    recipe.intro ? recipe.intro.toString() : ""
  );
  const [image, setImage] = useState("");
  const [tags, setTags] = useState<String[]>(
    recipe.tags.length > 0 ? recipe.tags : []
  );
  const [newTag, setNewTag] = useState("");
  const [ingredients, setIngredients] = useState<ingredientType[]>(
    ingredientsOld.length > 0
      ? ingredientsOld
      : [
          { name: "", amount: 0, unit: "" },
          { name: "", amount: 0, unit: "" },
          { name: "", amount: 0, unit: "" },
        ]
  );
  const [directions, setDirections] = useState<directionType[]>(
    directionsOld.length > 0 ? directionsOld : [{ order: 1, text: "" }]
  );

  const createRecipeHandler = (
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
        tags,
        image,
        intro: description,
      };

      createRecipe(newRecipe);
    }
  };

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

  const addTagHandler = () => {
    if (newTag !== "") {
      setTags(prevState => [...prevState, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (i: number) => {
    tags.splice(i, 1);
    setTags([...tags]);
  };

  return (
    <>
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
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div className="flex">
            {tags.map((tag, i) => (
              <div key={i} className="mr-2 bg-slate-500 rounded-lg p-1">
                <button value={tag} onClick={() => removeTag(i)}>
                  {tag}
                </button>
              </div>
            ))}
            <div>
              <input
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                className="w-24"
              />
              <button onClick={addTagHandler}>Add</button>
            </div>
          </div>
        </div>
        <div>
          <select
            className="appearance-none cursor-pointer w-80 border-b border-neutral-800 font-gothic text-3xl rounded-none transition duration-300 hover:bg-neutral-200 focus:bg-neutral-200"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {categoryOptions.map(selectOption => (
              <option key={selectOption}>{selectOption}</option>
            ))}
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
          onClick={e => createRecipeHandler(e)}
        >
          Add recipe
        </button>
      </div>
    </>
  );
};

export default EditRecipe;
