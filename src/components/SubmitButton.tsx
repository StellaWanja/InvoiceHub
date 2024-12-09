import { useFormStatus } from "react-dom";
import { Loader } from "lucide-react";

import { Button } from "@/components/ui/button";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button className="relative w-full font-semibold">
      <span className={pending ? "text-transparent" : ""}>Submit</span>
      {pending && (
        <span className="absolute w-full h-full flex items-center justify-center text-gray-300">
          <Loader className="animate-spin" />
        </span>
      )}
    </Button>
  );
};

export default SubmitButton;
