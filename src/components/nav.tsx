import { FunctionComponent } from "react";

const Nav: FunctionComponent = () => {
  return (
    <div className="mx-auto w-36 h-26 border-2 border-neutral-700">
      <p className="ml-16">
        <span className="text-[#897286] font-bold tracking-[0.25em]">what</span>
        <br />
        <span className="tracking-wide font-thin">do you</span> <br />
        <span className="font-bold text-xl tracking-widest text-[#81B297]">
          FEEL
        </span>
        <br />
        <span className="tracking-[.3em] font-thin">like?</span>
      </p>
    </div>
  );
};

export default Nav;
