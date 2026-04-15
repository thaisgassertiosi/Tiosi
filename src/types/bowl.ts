export type Bowl = {
  id: string;
  name: string;
  note: string;
  size: number;
  tagNumber: number;
  createdAt: string;
  /** Local file URI for a user-chosen bowl photo (device only; not a remote server). */
  photoUri?: string | null;
};
