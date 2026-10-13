"use client";

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

interface AvatarCropDialogProps {
  // Object URL do arquivo escolhido; null fecha o modal
  imageSrc: string | null;
  saving: boolean;
  onCancel: () => void;
  onSave: (area: Area) => void;
}

// O pai monta com key={imageSrc}: cada arquivo começa sem zoom e centralizado
export function AvatarCropDialog({
  imageSrc,
  saving,
  onCancel,
  onSave,
}: AvatarCropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);

  return (
    <Dialog
      open={imageSrc !== null}
      onOpenChange={(open) => {
        if (!open && !saving) onCancel();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajustar foto</DialogTitle>
          <DialogDescription>
            Arraste para enquadrar e use o controle para aproximar.
          </DialogDescription>
        </DialogHeader>

        <div className="relative h-72 w-full overflow-hidden rounded-lg bg-muted">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setArea(pixels)}
            />
          )}
        </div>

        <label className="grid gap-2 text-sm font-medium text-foreground">
          Zoom
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="accent-primary"
          />
        </label>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel} disabled={saving}>
            Cancelar
          </Button>
          <Button
            onClick={() => area && onSave(area)}
            disabled={saving || !area}
          >
            {saving ? "Salvando..." : "Salvar foto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
