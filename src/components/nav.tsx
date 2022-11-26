import { FunctionComponent } from "react";
import Link from "next/link";

const Nav: FunctionComponent = () => {
  return (
    <Link href={`/`}>
      <button className="mx-auto block w-32 h-26 border-2 border-neutral-700">
        <p className="ml-10">
          <span className="text-[#897286] font-bold tracking-[0.25em]">
            what
          </span>
          <br />
          <span className="tracking-wide font-thin">do you</span> <br />
          <span className="font-bold text-xl tracking-widest text-[#81B297]">
            FEEL
          </span>
          <br />
          <span className="tracking-[.3em] font-thin">like?</span>
        </p>
      </button>
    </Link>
  );
};

export default Nav;
