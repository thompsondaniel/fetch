"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getBreeds } from "@/app/http";

type Props = {
  selectedBreeds: string[];
  setSelectedBreeds: React.Dispatch<React.SetStateAction<string[]>>;
  handleSelection: () => void;
};

export const BreedSearch = (props: Props) => {
  const [open, setOpen] = React.useState(false);
  const [breeds, setBreeds] = React.useState<string[]>([]);
  const [localBreeds, setLocalBreeds] = React.useState<string[]>([]);

  React.useEffect(() => {
    getBreeds().then((x: string[]) => setBreeds(x));
    setLocalBreeds(props.selectedBreeds);
  }, []);

  return (
    <div className="mb-[10px] flex w-full ">
      <div className="search-wrapper flex w-full justify-end">
        {localBreeds.length > 0 && (
          <>
            <Button
              className="mr-[5px]"
              onClick={() => {
                props.setSelectedBreeds([]);
                props.handleSelection();
              }}
            >
              Clear
            </Button>
            <Button
              className="mr-[5px]"
              onClick={() => {
                props.setSelectedBreeds(localBreeds);
                props.handleSelection();
              }}
            >
              Apply
            </Button>
          </>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="search-bar justify-between"
            >
              <p className="truncate">
                {localBreeds.length
                  ? localBreeds.join(", ")
                  : "Select breed(s)"}
              </p>
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder="Search breeds" className="h-9" />
              <CommandList>
                <CommandEmpty>No breeds found.</CommandEmpty>
                <CommandGroup>
                  {breeds.map((x, i) => (
                    <CommandItem
                      key={i}
                      value={x}
                      onSelect={(currentValue) => {
                        if (localBreeds.find((f) => f === currentValue)) {
                          setLocalBreeds(
                            localBreeds.filter((f) => f !== currentValue)
                          );
                        } else {
                          setLocalBreeds((prev) => [...prev, currentValue]);
                        }
                      }}
                    >
                      {x}
                      <Check
                        className={cn(
                          "ml-auto",
                          localBreeds.find((f) => f === x)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
