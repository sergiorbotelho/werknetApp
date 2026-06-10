"use server";

import { authOptions } from "@/lib/authOptions";
import axios from "axios";
import { getServerSession } from "next-auth";

export async function getServerApi() {
  const session = await getServerSession(authOptions);

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    headers: {
      Authorization: session?.user?.token ? `Bearer ${session.user.token}` : "",
    },
  });
}
