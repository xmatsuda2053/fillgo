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

  async insertItem(t: Template): Promise<Number> {
    t.params = getParams(t.content);
    t.createdAt = new Date();
    t.updatedAt = new Date();
    return await db.templates.add(t);
  }

  async selectItemById(id?: number) {
    return await db.templates.get(id);
  }
}
export const db = new FillGoDB();
