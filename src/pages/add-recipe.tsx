import { FunctionComponent, useState } from 'react';
import Navbar from '../layout/navbar';
import Router from 'next/router';
import Head from 'next/head';

type ingredientType = {
  name: string;
  unit: string;
  amount: number;
};

type directionType = {
  order: number;
  text: string;
};

const buttonClasses =
  'inline-block px-6 py-2.5 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out w-full';

const AddRecipe: FunctionComponent = () => {
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [amount, setAmount] = useState(0);
  const [ingredients, setIngredients] = useState<ingredientType[]>([]);
  const [directionText, setDirectionText] = useState('');
  const [directions, setDirections] = useState<directionType[]>([]);

  const createRecipe = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (title !== '' && ingredients.length > 0 && directions.length > 0) {
      const newRecipe = {
        title,
        ingredients,
        directions,
      };

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecipe),
      })
        .then(response => {
          console.log(response);
          Router.push(`/recipe/${title}`);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const onAddIngredient = () => {
    if (name !== '' && amount !== 0) {
      setName('');
      setUnit('');
      setAmount(0);
      setIngredients(prevState => [
        ...prevState,
        {
          name: name,
          unit: unit,
          amount: amount,
        },
      ]);
    }
  };

  const onAddDirection = () => {
    if (directionText !== '') {
      setDirectionText('');
      setDirections(prevState => [
        ...prevState,
        {
          text: directionText,
          order: directions.length + 1,
        },
      ]);
    }
  };

  return (
    <>
      <Head>
        <title>Recipe Builder</title>
        <link rel="icon" href="/fork.png" />
      </Head>

      <Navbar />

      <div className="w-2/4 m-auto mt-5">
        <div className="w-full flex">
          <input
            placeholder="Recipe name"
            className="text-6xl w-full"
            value={title}
            onChange={e => setTitle(e.currentTarget.value)}
          />
        </div>

        <div className="flex mt-3 bg-slate-200 rounded-md">
          <div className="p-10">
            <h2 className="text-3xl font-bold mb-5">Ingredients</h2>
            {ingredients.map(ingredient => (
              <div key={ingredient.name} className="flex justify-between mb-2">
                <p>{ingredient.name}</p>
                <div className="flex">
                  <p className="mr-1">{ingredient.amount}</p>
                  <p>{ingredient.unit}</p>
                </div>
              </div>
            ))}

            <div className="flex mb-2">
              <input
                placeholder="Ingredient"
                className="mr-2 w-32"
                value={name}
                onChange={e => setName(e.currentTarget.value)}
              />
              <input
                placeholder="Amount"
                className="mr-2 w-10"
                type="number"
                value={amount}
                onChange={e => setAmount(parseFloat(e.currentTarget.value))}
              />
              <input
                placeholder="Unit"
                className="w-10"
                value={unit}
                onChange={e => setUnit(e.currentTarget.value)}
              />
            </div>
            <button className={buttonClasses} onClick={onAddIngredient}>
              Add Ingredient
            </button>
          </div>

          <div className="p-10">
            <h2 className="text-3xl font-bold mb-5">Directions</h2>
            {directions.map(direction => (
              <div key={direction.order} className="mb-5">
                <h2 className="text-xl font-bold">Step {direction.order}:</h2>
                <p>{direction.text}</p>
              </div>
            ))}
            <textarea
              value={directionText}
              onChange={e => setDirectionText(e.currentTarget.value)}
              className="w-full mb-2"
            />
            <button className={buttonClasses} onClick={onAddDirection}>
              Add Direction
            </button>
          </div>
        </div>
        <div className="w-2/4 m-auto mt-10">
          <button onClick={e => createRecipe(e)} className={buttonClasses}>
            Add recipe
          </button>
        </div>
      </div>
    </>
  );
};

export default AddRecipe;
