import { useState } from "react";
import Router from "next/router";
import Link from "next/link";
import Image from "next/image";
import { FunctionComponent } from "react";
import EditRecipe from "../components/editRecipe";
import { recipeType } from "../types/types";

const AddRecipe: FunctionComponent = () => {
  const [loading, setLoading] = useState(false);

  const createRecipe = async (newRecipe: recipeType) => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRecipe),
    }).then(() => {
      setLoading(false);
      Router.push(`/recipe/${newRecipe.slug}`);
    });
  };

  return (
    <>
      <EditRecipe createRecipe={createRecipe} loading={loading} />
    </>
  );
};

export default AddRecipe;
