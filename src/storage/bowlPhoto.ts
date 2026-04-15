import * as FileSystem from "expo-file-system";

const DIR = "bowl-photos";

/**
 * Copies the picked image into app storage and returns a stable file URI.
 * Returns null if storage is unavailable or copy fails (e.g. some web builds).
 */
export async function persistBowlPhoto(
  bowlId: string,
  sourceUri: string,
): Promise<string | null> {
  const base = FileSystem.documentDirectory;
  if (!base) return null;

  try {
    const dir = `${base}${DIR}/`;
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
    const dest = `${dir}${bowlId}.jpg`;
    await FileSystem.copyAsync({ from: sourceUri, to: dest });
    return dest;
  } catch {
    return null;
  }
}
