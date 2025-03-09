import { Dog, DogSearchResults } from "@/types/dogs";
import axios from "axios";

export const fetchApi = axios.create({
  baseURL: "https://frontend-take-home-service.fetch.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const login = (params: { name: string; email: string }) =>
  fetchApi.post("/auth/login", params);

export const getBreeds = () =>
  fetchApi.get("/dogs/breeds").then(({ data }) => data);

export const searchDogs = (params?: {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: number;
  sort?: string;
}): Promise<DogSearchResults> =>
  fetchApi.get("/dogs/search", { params }).then(({ data }) => data);

export const getDogsByIds = (body: string[]): Promise<Dog[]> =>
  fetchApi.post("/dogs", body).then(({ data }) => data);

export const getDogMatch = (body: string[]): Promise<{ match: string }> =>
  fetchApi.post("/dogs/match", body).then(({ data }) => data);
