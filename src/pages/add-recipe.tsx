import Router from "next/router";
import Link from "next/link";
import Image from "next/image";
import { FunctionComponent } from "react";
import EditRecipe from "../components/editRecipe";
import { recipeType } from "../types/types";

const AddRecipe: FunctionComponent = () => {
  const createRecipe = async (newRecipe: recipeType) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRecipe),
    }).then(() => {
      Router.push(`/recipe/${newRecipe.slug}`);
    });
  };

  return (
    <>
      <EditRecipe createRecipe={createRecipe} />
    </>
  );
};

export default AddRecipe;
