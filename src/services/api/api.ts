import axios from "axios";
import { getSession, signOut } from "next-auth/react";

let accessToken: string | null = null; // Armazenar o token em memória

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

    return Promise.reject(error);
  }
);
