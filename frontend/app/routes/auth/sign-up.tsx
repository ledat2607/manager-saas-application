import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router";

const SignUp = () => {
  return (
    <div className="flex flex-col justify-center border-2 w-3xl">
      <div className="flex gap-4 w-full justify-between">
        {/*Left content */}
        <div className="flex items-center flex-col justify-center">
          <h1 className="font-bold text-2xl ">Welcome back</h1>
          <span className="text-xs font-semibold text-balance text-muted-foreground">Sign in to countinue</span>
        </div>
        <div className="bg-gray-600">
          <h2>Picture</h2>
        </div>
      </div>
      <Link to={"/sign-in"}>
        <Button>Sign in</Button>
      </Link>
    </div>
  );
};

export default SignUp;
