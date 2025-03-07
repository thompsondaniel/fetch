import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useApiSessionHandler = () => {
  const router = useRouter();

  useEffect(() => {
    const handleError = (error: any) => {
      if (error.response?.status === 401) {
        console.log("Session expired, logging out...");
        router.push("/");
      }
    };

    // Listen for API errors (custom implementation may be needed)
    document.addEventListener("apiError", handleError);

    return () => {
      document.removeEventListener("apiError", handleError);
    };
  }, [router]);
};

export default useApiSessionHandler;
