export type DogSearchResults = {
  resultIds: string[];
  total: number;
  next: string;
  prev: string;
};

export type Dog = {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
};
