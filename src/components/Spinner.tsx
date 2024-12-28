import React from "react";
import { Loader } from "lucide-react";

function Spinner() {
  return (
    <div className="w-full flex items-center justify-center">
      <Loader className="animate-spin" width={50} height={50} />
    </div>
  );
}

export default Spinner;
