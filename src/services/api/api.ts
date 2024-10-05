import axios from "axios";
import { getSession } from "next-auth/react";

let accessToken: string | null = null; // Armazenar o token em memória

// Criar a instância do Axios
export const api = axios.create({
  baseURL: "http://localhost:3333",
});

// Adicionar um interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  async (config) => {
    if (!accessToken) {
      // Pegar a sessão apenas se o token ainda não foi obtido
      const session = await getSession();

      // Se existir uma sessão, armazena o token
      if (session && session.user.token) {
        accessToken = session.user.token;
      }
    }

    // Se o token estiver disponível, adicionar ao cabeçalho Authorization
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
