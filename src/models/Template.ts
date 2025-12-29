import type { Param } from "@/models/Param";

export interface Template {
  id?: number;
  title: string;
  content: string;
  params?: Param[];
  categoryId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
