import React, { FunctionComponent } from 'react';
import Link from 'next/link';

type CustomLinkProps = {
  path: string;
  name: string;
};

const CustomLink: FunctionComponent<CustomLinkProps> = ({ path, name }) => (
  <Link href={path}>
    <a className="font-bold border p-1 rounded bg-slate-200 m-1">{name}</a>
  </Link>
);

const Navbar: FunctionComponent = () => {
  return (
    <nav className="w-screen h-12 bg-white">
      <div className="max-w-6xl mx-auto h-full flex items-center">
        <CustomLink path={'/'} name={'All Recipes'} />
        <CustomLink path={'/add-recipe'} name={'Add Recipe'} />
      </div>
    </nav>
  );
};

export default Navbar;
