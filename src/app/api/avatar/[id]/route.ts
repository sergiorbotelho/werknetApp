import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

// <img> não envia o header Authorization: a rota busca a foto na API com o
// token da sessão (cookie) e repassa os bytes.
export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  if (!token) {
    return new Response(null, { status: 401 });
  }

  const response = await fetch(
    new URL(
      `users/${encodeURIComponent(params.id)}/avatar`,
      process.env.NEXT_PUBLIC_API,
    ),
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
  );

  if (!response.ok) {
    return new Response(null, { status: response.status });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") ?? "application/octet-stream",
      // A URL leva ?v=<avatarUpdatedAt>, então pode ficar em cache por um ano.
      // private: a CDN da Vercel não guarda a foto.
      "Cache-Control": "private, max-age=31536000, immutable",
    },
  });
}
