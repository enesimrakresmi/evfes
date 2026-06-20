export type Memory = {
  id: string;
  title: string;
  message: string;
  image_url: string | null;
  x: number;
  y: number;
  color: string;
  created_at: string;
};

export type MemoryInput = {
  title: string;
  message: string;
  image_url?: string | null;
};
