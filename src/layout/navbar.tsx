import React, { FunctionComponent } from 'react';
import Link from 'next/link';

const Navbar: FunctionComponent = () => {
  return (
    <nav className="w-screen h-12 bg-white">
      <div className="max-w-6xl mx-auto h-full flex items-center">
        <Link href={'/'}>
          <a className="font-bold border p-1 rounded bg-slate-200">
            All Recipes
          </a>
        </Link>
        <Link href={'/add-recipe'}>
          <a className="font-bold border p-1 rounded bg-slate-200">
            Add Recipe
          </a>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
