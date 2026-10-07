"use client";

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { IOrderService } from "@/types/order";
import { Download, Printer, Share2, X } from "lucide-react";
import dynamic from "next/dynamic";
import { TCreatedPdf } from "pdfmake/build/pdfmake";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { PdfStatus } from "./pdf-status";

// pdf.js depende de APIs do navegador; carrega só no cliente e quando o modal abre
const PdfViewer = dynamic(() => import("./pdf-viewer"), {
  ssr: false,
  loading: () => <PdfStatus />,
});


interface OrderPdfModalProps {
  order: IOrderService;
  onClose: () => void;
}

export function OrderPdfModal({ order, onClose }: OrderPdfModalProps) {
  const [pdf, setPdf] = useState<TCreatedPdf | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [failed, setFailed] = useState(false);

  const fileName = `OS-${order.id}.pdf`;

  useEffect(() => {
    let cancelled = false;

    // pdfmake + fontes (~1 MB) só são baixados quando o modal abre
    import("@/report/pdfOrder")
      .then(({ createOrderPdf }) => createOrderPdf(order))
      .then(
        (created) =>
          new Promise<void>((resolve) => {
            created.getBlob((result) => {
              if (!cancelled) {
                setPdf(created);
                setBlob(result);
              }
              resolve();
            });
          }),
      )
      .catch((error) => {
        console.error("Erro ao gerar PDF:", error);
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [order]);

  const file = useMemo(
    () =>
      blob ? new File([blob], fileName, { type: "application/pdf" }) : null,
    [blob, fileName],
  );

  // Celular: tela de toque; compartilhar só se o navegador aceitar arquivos
  const isMobile = useMemo(
    () => window.matchMedia("(pointer: coarse)").matches,
    [],
  );
  const canShare = useMemo(
    () =>
      !!file &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [file] }),
    [file],
  );

  const handleDownload = () => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleShare = async () => {
    if (!file) return;
    try {
      await navigator.share({ files: [file], title: `OS ${order.id}` });
    } catch (error) {
      if ((error as Error)?.name !== "AbortError") {
        console.error(error);
        toast.error("Não foi possível compartilhar o PDF.");
      }
    }
  };

  const handlePrint = () => {
    if (!pdf) return;
    // A aba precisa ser aberta ainda dentro do clique, senão o Safari (iOS) bloqueia
    const win = window.open("", "_blank");
    if (!win) {
      toast.error("O navegador bloqueou a abertura do PDF.");
      return;
    }
    win.document.title = `OS ${order.id}`;
    win.document.body.innerText = "Gerando PDF...";

    // No PC abre já com a janela de impressão; no celular abre o leitor nativo
    if (isMobile) pdf.open({}, win);
    else pdf.print({}, win);
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="flex h-[90dvh] w-[95vw] max-w-3xl flex-col gap-0 overflow-hidden p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <DialogTitle className="text-lg font-semibold">
            Ordem de Serviço #{order.id}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} title="Fechar">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative flex-1 overflow-y-auto bg-muted p-3 pb-24 sm:p-6 sm:pb-24">
          {failed ? (
            <PdfStatus message="Não foi possível gerar o PDF." />
          ) : blob ? (
            <PdfViewer file={blob} />
          ) : (
            <PdfStatus />
          )}
        </div>

        {pdf && blob && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full border bg-card p-2 shadow-lg">
            {isMobile && canShare ? (
              <Button className="rounded-full" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar
              </Button>
            ) : (
              <Button className="rounded-full" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
            <Button
              variant="outline"
              className="rounded-full"
              onClick={handlePrint}
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
