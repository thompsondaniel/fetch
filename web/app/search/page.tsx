"use client";
import React from "react";
import { DataTable } from "./data-table";
import { getDogsByIds, searchDogs } from "../http";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dog } from "@/types/dogs";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Loader } from "@/components/Loader";
import { BreedSearch } from "@/components/BreedSearch";
import { toast } from "react-toastify";

export default function Search() {
  const [dogs, setDogs] = React.useState<Dog[]>([]);
  const [page, setPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState<"breed" | "name" | "age">("breed");
  const [sortOrder, setSortOrder] = React.useState("");
  const [selectedBreeds, setSelectedBreeds] = React.useState<string[]>([]);

  const itemsPerPage = 10;
  const batchSize = 50;
  const pagesPerBatch = batchSize / itemsPerPage;

  const handleSort = (column: "breed" | "name" | "age") => {
    setSortBy(column);
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setDogs([]);
    setPage(1);
  };

  const columns: ColumnDef<Dog>[] = [
    {
      accessorKey: "img",
      header: "Image",
      cell: ({ row }) => {
        return (
          <div className="size-[50px]">
            <img
              className="object-contain size-full"
              src={row.getValue("img")}
              alt="dog-image"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: () => {
        return (
          <Button variant="ghost" onClick={() => handleSort("name")}>
            <p className={`${sortBy === "name" ? "font-bold text-black" : ""}`}>
              Name
            </p>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "age",
      header: () => {
        return (
          <Button variant="ghost" onClick={() => handleSort("age")}>
            <p className={`${sortBy === "age" ? "font-bold text-black" : ""}`}>
              Age
            </p>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "zip_code",
      header: "Zip Code",
    },
    {
      accessorKey: "breed",
      header: () => {
        return (
          <Button variant="ghost" onClick={() => handleSort("breed")}>
            <p
              className={`${sortBy === "breed" ? "font-bold text-black" : ""}`}
            >
              Breed
            </p>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  React.useEffect(() => {
    const batchNumber = Math.ceil(page / pagesPerBatch);
    const itemsNeeded = batchNumber * batchSize;

    if (dogs.length < itemsNeeded) {
      searchDogs({
        breeds: selectedBreeds,
        sort: !sortBy || !sortOrder ? "breed:asc" : `${sortBy}:${sortOrder}`,
        from: (batchNumber - 1) * batchSize,
        size: batchSize,
      })
        .then((results) =>
          getDogsByIds(results.resultIds).then((d) => {
            setDogs((prev) => [...prev, ...d]);
          })
        )
        .catch(() => {
          toast.error("Something went wrong...");
        });
    }
  }, [page, sortBy, sortOrder, selectedBreeds]);

  const paginatedData = dogs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="page">
      <Card className="card-lg">
        <CardHeader className="card-header">
          <CardTitle>Welcome to Fetch</CardTitle>
          <CardDescription>Please search for a dog below.</CardDescription>
        </CardHeader>
        <CardContent>
          {dogs.length ? (
            <div className="container mx-auto py-10 flex flex-col">
              <BreedSearch
                selectedBreeds={selectedBreeds}
                setSelectedBreeds={setSelectedBreeds}
                handleSelection={() => {
                  setDogs([]);
                  setPage(1);
                }}
              />
              <DataTable
                columns={columns}
                data={paginatedData}
                onNext={() => setPage((p) => p + 1)}
                onPrev={() => setPage((p) => Math.max(p - 1, 0))}
                hidePrev={page === 1}
              />
            </div>
          ) : (
            <Loader />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
