import { FunctionComponent, useState, useCallback } from 'react';
import Navbar from '../layout/navbar';
import Router from 'next/router';
import HeadWrapper from '../layout/headWrapper';
import { ingredientType, directionType } from '../types/types';
import slugify from 'slugify';
import { categoryOptions } from '../../utils/constants';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

const buttonClasses =
  'inline-block px-6 py-2.5 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out w-full';

const AddRecipe: FunctionComponent = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Breakfast');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [ingredients, setIngredients] = useState<ingredientType[]>([
    { name: '', amount: 0, unit: '' },
  ]);
  const [directions, setDirections] = useState<directionType[]>([
    { order: 1, text: '' },
  ]);

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
      method: 'POST',
      body: formData,
    });

    if (upload.ok) {
      console.log('Uploaded successfully!');
      setImage(filename);
    } else {
      console.error('Upload failed.');
    }
  }, []);

  console.log(image);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const createRecipe = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (title !== '' && ingredients.length > 0 && directions.length > 0) {
      const slug = slugify(title, { lower: true });

      const newRecipe = {
        slug,
        title,
        ingredients,
        directions,
        category,
        image,
        intro: description,
      };

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecipe),
      }).then(() => {
        Router.push(`/recipe/${slug}`);
      });
    }
  };

  const onAddIngredient = () => {
    setIngredients(prevState => [
      ...prevState,
      {
        name: '',
        amount: 0,
        unit: '',
      },
    ]);
  };

  const onAddDirection = () => {
    setDirections(prevState => [
      ...prevState,
      { order: directions.length + 1, text: '' },
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
              e.currentTarget.name === 'amount'
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
      <Navbar />

      <div className="max-w-3xl m-auto mt-5">
        <div className="w-full flex">
          <input
            placeholder="Recipe name"
            className="text-6xl w-full"
            value={title}
            onChange={e => setTitle(e.currentTarget.value)}
          />
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {categoryOptions.map(selectOption => (
              <option key={selectOption}>{selectOption}</option>
            ))}
          </select>
        </div>

        <div>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag n drop some files here, or click to select files</p>
          )}
        </div>

        <Image
          className="w-5 h-5"
          width={200}
          height={100}
          src={`https://recipe-builder-pictures.s3.eu-west-1.amazonaws.com/${image}`}
          alt=""
        />

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
          <button className={buttonClasses} onClick={e => createRecipe(e)}>
            Add recipe
          </button>
        </div>
      </div>
    </>
  );
};

export default AddRecipe;
