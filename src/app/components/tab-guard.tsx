"use client";

import {
  HEARTBEAT_MS,
  LAST_SEEN_KEY,
  MAX_IDLE_GAP_MS,
  TAB_CHANNEL,
  TAB_FLAG_KEY,
  markTabSession,
  touchLastSeen,
} from "@/lib/tab-session";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { LoadingSpinner } from "./ui/loading";

type TabStatus = "checking" | "active" | "blocked";

type TabMessage = { type: "ping" | "pong" | "takeover"; from: string };

// Tempo de espera pela resposta de outras abas abertas
const PING_TIMEOUT_MS = 300;

const ALERT_FAVICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#dc2626"/><rect x="14" y="6.5" width="4" height="13" rx="2" fill="#fff"/><circle cx="16" cy="24.5" r="2.4" fill="#fff"/></svg>`,
  );

function readSession(key: string) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function lastSeenIsRecent() {
  try {
    const lastSeen = Number(localStorage.getItem(LAST_SEEN_KEY) ?? 0);
    return Date.now() - lastSeen < MAX_IDLE_GAP_MS;
  } catch {
    return false;
  }
}

export function TabGuard() {
  const [status, setStatus] = useState<TabStatus>("checking");
  const [closeFailed, setCloseFailed] = useState(false);
  const tabId = useRef(Math.random().toString(36).slice(2));

  useEffect(() => {
    const id = tabId.current;
    const channel = new BroadcastChannel(TAB_CHANNEL);
    const send = (type: TabMessage["type"]) =>
      channel.postMessage({ type, from: id } satisfies TabMessage);

    let otherTabAlive = false;
    let decided = false;

    channel.onmessage = (event: MessageEvent<TabMessage>) => {
      const msg = event.data;
      if (!msg || msg.from === id) return;

      if (msg.type === "ping") send("pong");
      if (msg.type === "pong") otherTabAlive = true;
      if (msg.type === "takeover") setStatus("blocked");
    };

    send("ping");

    const timer = setTimeout(() => {
      const hasSession = readSession(TAB_FLAG_KEY) === "1";

      // Nenhuma aba aberta e esta aba não vem de um F5 recente: navegador/aba foi fechado
      if (!otherTabAlive && !(hasSession && lastSeenIsRecent())) {
        signOut({ callbackUrl: "/login" });
        return;
      }

      // A aba mais recente sempre assume e bloqueia as demais
      decided = true;
      markTabSession();
      setStatus("active");
      send("takeover");
    }, PING_TIMEOUT_MS);

    const heartbeat = setInterval(() => {
      if (decided) touchLastSeen();
    }, HEARTBEAT_MS);

    const handlePageHide = () => {
      if (decided) touchLastSeen();
    };
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      clearTimeout(timer);
      clearInterval(heartbeat);
      window.removeEventListener("pagehide", handlePageHide);
      channel.close();
    };
  }, []);

  // Favicon com exclamação vermelha enquanto a aba estiver bloqueada
  useEffect(() => {
    if (status !== "blocked") return;

    const links = Array.from(
      document.querySelectorAll<HTMLLinkElement>("link[rel~='icon']"),
    );
    const originals = links.map((link) => ({
      link,
      href: link.getAttribute("href"),
      type: link.getAttribute("type"),
    }));

    let created: HTMLLinkElement | null = null;
    if (links.length === 0) {
      created = document.createElement("link");
      created.rel = "icon";
      document.head.appendChild(created);
      links.push(created);
    }

    links.forEach((link) => {
      link.type = "image/svg+xml";
      link.href = ALERT_FAVICON;
    });

    return () => {
      created?.remove();
      originals.forEach(({ link, href, type }) => {
        if (href) link.setAttribute("href", href);
        if (type) link.setAttribute("type", type);
        else link.removeAttribute("type");
      });
    };
  }, [status]);

  const handleUseHere = () => {
    // Recarrega para buscar dados atualizados; ao recarregar, esta aba assume como ativa
    window.location.reload();
  };

  const handleClose = () => {
    window.close();
    // Navegadores só permitem fechar abas abertas via script
    setCloseFailed(true);
  };

  if (status === "active") return null;

  if (status === "checking") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
        <LoadingSpinner size={32} className="text-primary" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6 shadow-glow bg-card-gradient">
        <p className="text-foreground">
          O Werk OS está aberto em outra aba. Clique em &quot;Usar aqui&quot;
          para usar o Werk OS nesta aba.
        </p>
        {closeFailed && (
          <p className="mt-3 text-sm text-muted-foreground">
            Não foi possível fechar automaticamente. Feche esta aba manualmente.
          </p>
        )}
        <div className="mt-8 flex justify-end gap-3">
          <Button variant="ghost" onClick={handleClose}>
            Fechar
          </Button>
          <Button onClick={handleUseHere}>Usar aqui</Button>
        </div>
      </Card>
    </div>
  );
}
