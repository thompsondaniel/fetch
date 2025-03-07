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

export default function Search() {
  //   const [breeds, setBreeds] = React.useState<string[]>([]);
  //   const [selectedBreeds, setSelectedBreeds] = React.useState<string[]>([]);
  const [dogs, setDogs] = React.useState<Dog[]>([]);
  const [page, setPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState<"breed" | "name" | "age">("breed");
  const [sortOrder, setSortOrder] = React.useState("asc");

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
            Name
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
            Age
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
            Breed
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  //   React.useEffect(() => {
  //     getBreeds().then((x: any) => setBreeds(x));
  //   }, []);

  React.useEffect(() => {
    const batchNumber = Math.ceil(page / pagesPerBatch);
    const itemsNeeded = batchNumber * batchSize;

    if (dogs.length < itemsNeeded) {
      searchDogs({
        sort: `${sortBy}:${sortOrder}`,
        from: (batchNumber - 1) * batchSize,
        size: batchSize,
      })
        .then((results) =>
          getDogsByIds(results.resultIds).then((d) => {
            setDogs((prev) => [...prev, ...d]);
          })
        )
        .catch((e) => {
          console.error(e);
        });
    }
  }, [page, sortBy, sortOrder]);

  const paginatedData = dogs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="card-lg">
        <CardHeader className="card-header">
          <CardTitle>Welcome to Fetch</CardTitle>
          <CardDescription>Please search for a dog below.</CardDescription>
        </CardHeader>
        <CardContent>
          {dogs.length ? (
            <div className="container mx-auto py-10">
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
