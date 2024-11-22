import * as React from "react";
import { Clock } from "lucide-react";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { Button } from "@/app/components/ui/button";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  update: string;
}

export function TimePicker({ value, onChange, update }: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="grid gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
            disabled={update !== "Salvar" ? true : false}
          >
            {value.slice(0, 5) || "Digite o horario..."}
            <Clock className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <Input
            type="time"
            value={value}
            onChange={handleTimeChange}
            className="w-full"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
