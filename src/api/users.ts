import type { User, UserFormData } from "../types";

const BASE_URL = "https://dummyjson.com/users";

export const PAGE_SIZE = 10;


const LAST_SERVER_ID = 208;

async function http<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`فشل الطلب (${res.status})`);
  }
  return res.json();
}

export function getUsers(search: string, page: number) {
  const skip = (page - 1) * PAGE_SIZE;
  const url = search
    ? `${BASE_URL}/search?q=${encodeURIComponent(search)}&limit=${PAGE_SIZE}&skip=${skip}`
    : `${BASE_URL}?limit=${PAGE_SIZE}&skip=${skip}`;

  return http<{ users: User[]; total: number }>(url);
}

export function addUser(data: UserFormData) {
  return http<User>(`${BASE_URL}/add`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateUser(id: number, data: UserFormData): Promise<User> {
  if (id > LAST_SERVER_ID) return { id, ...data };

  return http<User>(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id: number) {
  if (id > LAST_SERVER_ID) return;

  await http(`${BASE_URL}/${id}`, { method: "DELETE" });
}