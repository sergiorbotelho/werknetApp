import { LoadingSpinner } from "../ui/loading";

interface PdfStatusProps {
  message?: string;
}

// Centralizado na área do visualizador (o container de rolagem é `relative`)
export function PdfStatus({ message }: PdfStatusProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-muted-foreground">
      {message ? (
        <p>{message}</p>
      ) : (
        <>
          <LoadingSpinner size={36} className="text-primary" />
          <p className="text-sm">Carregando PDF...</p>
        </>
      )}
    </div>
  );
}
