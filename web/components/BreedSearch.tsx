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

  React.useEffect(() => {
    getBreeds().then((x: any) => setBreeds(x));
  }, []);

  return (
    <div className="mb-[10px] self-end">
      <div className="flex">
        {props.selectedBreeds.length > 0 && (
          <Button
            onClick={() => {
              props.setSelectedBreeds([]);
              props.handleSelection();
            }}
          >
            Clear
          </Button>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[400px] justify-between"
            >
              <p className="truncate">
                {props.selectedBreeds.length
                  ? props.selectedBreeds.join(", ")
                  : "Select breed..."}
              </p>
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder="Search framework..." className="h-9" />
              <CommandList>
                <CommandEmpty>No breeds found.</CommandEmpty>
                <CommandGroup>
                  {breeds.map((x, i) => (
                    <CommandItem
                      key={i}
                      value={x}
                      onSelect={(currentValue) => {
                        if (
                          props.selectedBreeds.find((f) => f === currentValue)
                        ) {
                          props.setSelectedBreeds(
                            props.selectedBreeds.filter(
                              (f) => f !== currentValue
                            )
                          );
                        } else {
                          props.setSelectedBreeds((prev) => [
                            ...prev,
                            currentValue,
                          ]);
                        }
                        props.handleSelection();
                      }}
                    >
                      {x}
                      <Check
                        className={cn(
                          "ml-auto",
                          props.selectedBreeds.find((f) => f === x)
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
