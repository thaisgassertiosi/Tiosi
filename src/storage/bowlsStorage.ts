import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Bowl } from "../types/bowl";

const STORAGE_KEY = "@tiosi/bowls_v1";

export async function loadBowls(): Promise<Bowl[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as Bowl[];
  } catch {
    return [];
  }
}

export async function saveBowls(bowls: Bowl[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bowls));
}

export async function addBowl(bowl: Bowl): Promise<Bowl[]> {
  const existing = await loadBowls();
  const next = [bowl, ...existing];
  await saveBowls(next);
  return next;
}

export async function getBowlById(id: string): Promise<Bowl | null> {
  const bowls = await loadBowls();
  return bowls.find((b) => b.id === id) ?? null;
}
