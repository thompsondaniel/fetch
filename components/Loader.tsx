import Dog from "../public/loading.gif";
import Image from "next/image";

export const Loader = () => {
  return (
    <div className="flex align-center justify-center size-full">
      <Image src={Dog} alt="loading" height={150} />
    </div>
  );
};
