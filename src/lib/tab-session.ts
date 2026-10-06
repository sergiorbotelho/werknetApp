// Controle de sessão por aba: logout ao fechar todas as abas e uma única aba ativa.
export const TAB_FLAG_KEY = "werk:tab-session"; // sessionStorage: aba pertence a uma sessão logada
export const LAST_SEEN_KEY = "werk:last-seen"; // localStorage: último sinal de vida de qualquer aba
export const TAB_CHANNEL = "werk:tabs";

// Tempo máximo sem nenhuma aba viva para considerar que o navegador foi fechado
export const MAX_IDLE_GAP_MS = 30_000;
export const HEARTBEAT_MS = 10_000;

export function touchLastSeen() {
  try {
    localStorage.setItem(LAST_SEEN_KEY, String(Date.now()));
  } catch {}
}

// Chamado no login para que a aba atual seja reconhecida como sessão válida
export function markTabSession() {
  try {
    sessionStorage.setItem(TAB_FLAG_KEY, "1");
  } catch {}
  touchLastSeen();
}
