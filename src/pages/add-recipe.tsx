import { FunctionComponent, useState } from 'react';

type ingredient = {
  name: String;
  unit: String;
  amount: number;
};

const IngredientInput: FunctionComponent = () => {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [amount, setAmount] = useState(0);

  return (
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
  );
};

const AddRecipe: FunctionComponent = () => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState<ingredient[]>([]);

  const createRecipe = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    const newRecipe = {
      title,
    };

    fetch('http://localhost:3000/api/recipes', {
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

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <button onClick={e => createRecipe(e)}>Add recipe</button>
      <div className="flex flex-col">
        <input
          placeholder="Recipe name"
          className="m-2"
          value={title}
          onChange={e => setTitle(e.currentTarget.value)}
        />
        <IngredientInput />
        <button>Add Ingredient</button>
      </div>
    </div>
  );
};

export default AddRecipe;
