"use client";

import { Check, Lightbulb, X } from "lucide-react";
import { MouseEvent } from "react";
import { IconProps, ToastContainer } from "react-toastify";

// O lucide não tem um "!" sozinho; desenhado no mesmo traço dos outros ícones.
function ExclamationIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v9" />
      <path d="M12 19h.01" />
    </svg>
  );
}

function ToastIcon({ type }: IconProps) {
  switch (type) {
    case "success":
      return <Check size={20} strokeWidth={3} aria-hidden="true" />;
    case "warning":
      return <ExclamationIcon />;
    case "error":
      return <X size={20} strokeWidth={3} aria-hidden="true" />;
    default:
      return <Lightbulb size={20} strokeWidth={2.25} aria-hidden="true" />;
  }
}

// A v10 não exporta CloseButtonProps.
function ToastCloseButton({
  closeToast,
}: {
  closeToast: (e: MouseEvent<HTMLElement>) => void;
}) {
  return (
    <button
      type="button"
      aria-label="Fechar notificação"
      className="werk-toast-close"
      onClick={closeToast}
    >
      <X size={18} aria-hidden="true" />
    </button>
  );
}

// Estilos em globals.css (seção "Toasts").
export function AppToaster() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={2000}
      toastClassName="werk-toast"
      icon={ToastIcon}
      // Teste sem o X; para voltar: closeButton={ToastCloseButton} e hideProgressBar.
      closeButton={false}
    />
  );
}
