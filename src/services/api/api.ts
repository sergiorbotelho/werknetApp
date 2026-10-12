import axios from "axios";
import { getSession, signOut } from "next-auth/react";

let accessToken: string | null = null; // Armazenar o token em memória

// Confere na API se o 403 veio de uma senha redefinida pelo admin com a sessão aberta.
// Usa axios puro para não passar de novo por este interceptor.
async function mustChangePassword() {
  try {
    const { data } = await axios.get("/me", {
      baseURL: process.env.NEXT_PUBLIC_API,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data.mustChangePassword === true;
  } catch {
    return false;
  }
}

// Criar a instância do Axios
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API, // Substitua pela URL correta da sua API
});

// Interceptor de requisição
api.interceptors.request.use(
  async (config) => {
    try {
      // Verifica se o token já foi carregado
      if (!accessToken) {
        const session = await getSession(); // Obtém a sessão atual
        if (session?.user?.token) {
          accessToken = session.user.token; // Armazena o token em memória
        }
      }

      // Adiciona o token no cabeçalho Authorization
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    } catch (error) {
      console.error("Erro ao configurar o token:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta para lidar com erros de autenticação
api.interceptors.response.use(
  (response) => response, // Retorna a resposta normalmente
  async (error) => {
    if (error.response?.status === 401) {
      console.log("Token expirado ou inválido. Redirecionando para login...");
      accessToken = null; // Limpa o token armazenado na memória

      // Faz logout e redireciona o usuário para a página de login
      await signOut({ callbackUrl: "/login" });
    }

    if (
      error.response?.status === 403 &&
      accessToken &&
      (await mustChangePassword())
    ) {
      // A página /alterar-senha confere o /me no servidor e mostra o formulário
      window.location.assign("/alterar-senha");
    }

    return Promise.reject(error);
  }
);
