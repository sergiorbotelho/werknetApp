import { ReactNode } from "react";
import { toast as toastify, ToastOptions } from "react-toastify";

// Título padrão de cada tipo; a mensagem passada vira a descrição abaixo dele.
const TITLES = {
  success: "Sucesso!",
  info: "Informação",
  warning: "Atenção!",
  error: "Algo deu errado!",
} as const;

type ToastType = keyof typeof TITLES;
type Options = ToastOptions & { title?: string };

function ToastMessage({ title, message }: { title: string; message: ReactNode }) {
  return (
    <div>
      <p className="werk-toast-title">{title}</p>
      {message ? <div className="werk-toast-message">{message}</div> : null}
    </div>
  );
}

function show(type: ToastType) {
  return (message: ReactNode, { title = TITLES[type], ...options }: Options = {}) =>
    toastify[type](<ToastMessage title={title} message={message} />, options);
}

export const toast = {
  success: show("success"),
  info: show("info"),
  warning: show("warning"),
  error: show("error"),
};
