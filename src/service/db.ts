import Dexie, { Table } from "dexie";
import { getParams } from "./utils";

export interface Template {
  id?: number;
  title: string;
  content: string;
  params?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class FillGoDB extends Dexie {
  templates!: Table<Template>;

  constructor() {
    super("FillGoDB");
    this.version(1).stores({
      templates: "++id, title, createdAt, updatedAt",
    });
  }

  async insertItem(t: Template): Promise<number> {
    t.params = getParams(t.content);
    t.createdAt = new Date();
    t.updatedAt = new Date();
    return await db.templates.add(t);
  }

  async selectItems(): Promise<Template[]> {
    return await db.templates.toArray();
  }

  async selectItemById(id: number): Promise<Template | undefined> {
    return await db.templates.get(id);
  }

  async updateItem(id: number, t: Template) {
    await db.templates.update(id, {
      title: t.title,
      content: t.content,
      params: getParams(t.content),
      updatedAt: new Date(),
    });
  }

  async deleteItem(id: number) {
    await db.templates.delete(id);
  }
}
export const db = new FillGoDB();
