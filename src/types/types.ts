export type ingredientType = {
  name: string;
  unit: string;
  amount: number;
};

export type directionType = {
  order: number;
  text: string;
};

export type recipeType = {
  id: React.Key;
  title: String;
  slug: String;
  directions: directionType[];
  ingredients: ingredientType[];
};