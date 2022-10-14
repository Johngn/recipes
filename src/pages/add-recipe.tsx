import { FunctionComponent, useState } from 'react';
import Navbar from '../layout/navbar';

type ingredientType = {
  name: string;
  unit: string;
  amount: number;
};

type directionType = {
  order: number;
  text: string;
};

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

    const newRecipe = {
      title,
      ingredients,
      directions,
    };

    fetch(`${process.env.API_URL}/api/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRecipe),
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const onAddIngredient = () => {
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
  };

  const onAddDirection = () => {
    const lastDirection = directions.length + 1;
    setDirectionText('');
    setDirections(prevState => [
      ...prevState,
      {
        text: directionText,
        order: directions.length + 1,
      },
    ]);
  };

  return (
    <>
      <Navbar />
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <button onClick={e => createRecipe(e)}>Add recipe</button>
        <div className="flex flex-col">
          <input
            placeholder="Recipe name"
            className="m-2"
            value={title}
            onChange={e => setTitle(e.currentTarget.value)}
          />

          {ingredients.map(ingredient => (
            <div key={ingredient.name} className="flex border justify-between">
              <p>{ingredient.name}</p>
              <p>{ingredient.unit}</p>
              <p>{ingredient.amount}</p>
            </div>
          ))}

          <div className="m-2">
            <input
              placeholder="Ingredient"
              className="m-2"
              value={name}
              onChange={e => setName(e.currentTarget.value)}
            />
            <input
              placeholder="Unit"
              className="m-2"
              value={unit}
              onChange={e => setUnit(e.currentTarget.value)}
            />
            <input
              placeholder="Amount"
              className="m-2"
              value={amount}
              onChange={e => setAmount(parseFloat(e.currentTarget.value))}
            />
          </div>
          <button onClick={onAddIngredient}>Add Ingredient</button>
          {directions.map(direction => (
            <p key={direction.order}>{direction.text}</p>
          ))}
          <textarea
            value={directionText}
            onChange={e => setDirectionText(e.currentTarget.value)}
          />
          <button onClick={onAddDirection}>Add Direction</button>
        </div>
      </div>
    </>
  );
};

export default AddRecipe;
