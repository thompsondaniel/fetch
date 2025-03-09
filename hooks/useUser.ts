import { create } from "zustand";

type User = {
  name: string;
  email: string;
};

type Props = {
  user: User | undefined;
  expiration: number | null;
  setUser: (user: User, expiresInMs: number, router: any) => void;
  clearUser: (router?: any) => void;
  checkTokenExpiration: (router: any) => void;
};

const getStoredUser = (): {
  user: User | undefined;
  expiration: number | null;
} => {
  if (typeof window === "undefined")
    return { user: undefined, expiration: null };

  try {
    const savedUser = localStorage.getItem("user");
    const savedExpiration = localStorage.getItem("expiration");

    return {
      user: savedUser ? JSON.parse(savedUser) : undefined,
      expiration: savedExpiration ? parseInt(savedExpiration, 10) : null,
    };
  } catch (error) {
    console.error("Error parsing user from localStorage", error);
    return { user: undefined, expiration: null };
  }
};

const useUser = create<Props>((set) => {
  const { user, expiration } = getStoredUser();

  return {
    user,
    expiration,
    setUser: (user: User, expiresInMs: number, router: any) => {
      const expirationTime = Date.now() + expiresInMs;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("expiration", expirationTime.toString());

      set({ user, expiration: expirationTime });

      setTimeout(() => {
        useUser.getState().clearUser(router);
      }, expiresInMs);
    },
    clearUser: (router) => {
      localStorage.removeItem("user");
      localStorage.removeItem("expiration");
      set({ user: undefined, expiration: null });

      if (router) {
        router.push("/");
      }
    },
    checkTokenExpiration: (router) => {
      const currentTime = Date.now();
      const { expiration } = useUser.getState();

      if (expiration && currentTime >= expiration) {
        useUser.getState().clearUser(router);
      }
    },
  };
});

export default useUser;
