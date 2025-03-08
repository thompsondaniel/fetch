"use client";
import React from "react";
import { DataTable } from "./data-table";
import { getDogMatch, getDogsByIds, searchDogs } from "../http";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Search() {
  const [dogs, setDogs] = React.useState<Dog[]>([]);
  const [page, setPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState<"breed" | "name" | "age">("breed");
  const [sortOrder, setSortOrder] = React.useState("");
  const [selectedBreeds, setSelectedBreeds] = React.useState<string[]>([]);
  const [selectedDogs, setSelectedDogs] = React.useState<Dog[]>([]);
  const [showDialog, setShowDialog] = React.useState(false);
  const [match, setMatch] = React.useState<Dog>();

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
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            selectedDogs.length > 0 &&
            table
              .getRowModel()
              .rows.every((row) =>
                selectedDogs.some((dog) => dog.id === row.original.id)
              )
          }
          onCheckedChange={(value) => {
            if (value) {
              setSelectedDogs((prev) => [
                ...prev,
                ...table
                  .getRowModel()
                  .rows.filter(
                    (row) => !prev.some((dog) => dog.id === row.original.id)
                  )
                  .map((row) => row.original),
              ]);
            } else {
              setSelectedDogs((prev) =>
                prev.filter(
                  (dog) =>
                    !table
                      .getRowModel()
                      .rows.some((row) => row.original.id === dog.id)
                )
              );
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedDogs.some((f) => f.id === row.original.id)}
          onCheckedChange={() => {
            if (selectedDogs.some((f) => f.id === row.original.id)) {
              setSelectedDogs(
                selectedDogs.filter((f) => f.id !== row.original.id)
              );
            } else {
              setSelectedDogs((prev) => [...prev, row.original]);
            }
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
      {selectedDogs.length ? (
        <Card className="card-sm animate__animated animate__fadeInRight">
          <CardHeader className="card-header">
            <CardTitle>Your Favorites!</CardTitle>
            <CardDescription>
              Once you&apos;ve selected your favorites, click &quot;Find
              Match&quot; to get your perfect match!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-[500px] overflow-auto">
              {selectedDogs.map((x, i) => (
                <p key={i}>{x.name}</p>
              ))}
            </div>
            <div>
              <Button
                className="mt-4 w-full btn-primary"
                disabled={!selectedDogs.length}
                onClick={() => {
                  getDogMatch(selectedDogs.map((d) => d.id))
                    .then(({ match }) => {
                      setMatch(selectedDogs.find((f) => f.id === match));
                      setShowDialog(true);
                    })
                    .catch(() =>
                      toast.error("An error occurred while finding your match.")
                    );
                }}
              >
                Find Your Match
              </Button>
              <Button
                className="mt-2 w-full"
                onClick={() => setSelectedDogs([])}
              >
                Clear All
              </Button>
              {match !== undefined && (
                <Button
                  className="mt-2 w-full btn-clear"
                  onClick={() => setShowDialog(true)}
                >
                  View Match
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <></>
      )}
      {match !== undefined && (
        <Dialog
          open={showDialog}
          onOpenChange={() => setShowDialog(!showDialog)}
        >
          <DialogTrigger />
          <DialogContent className="align-center justify-center">
            <DialogTitle className="text-center">
              We&apos;ve found a match!
            </DialogTitle>
            <DialogDescription className="text-center text-[18px]">
              Your match is{" "}
              <b>{selectedDogs.find((f) => f.id === match.id)?.name}</b>!
            </DialogDescription>
            <div className="size-[300px]">
              <img
                className="object-contain size-full"
                src={match.img}
                alt="dog-image"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
