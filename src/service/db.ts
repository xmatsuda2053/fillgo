import Dexie, { Table } from "dexie";

export interface Template {
  id?: number;
  title: string;
  content: string;
  params?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class FillGoDB extends Dexie {
  templates!: Table<Template>;

  constructor() {
    super("FillGoDB");
    this.version(1).stores({
      templates: "++id, title, createdAt, updatedAt",
    });
  }

  async insertItem(t: Template) {
    t.params = this._getParams(t.content);
    return await db.templates.add(t);
  }

  async selectItem(id?: number) {
    return await db.templates.get(id);
  }

  private _getParams(content: string): string[] {
    const pattern: RegExp = /{[^}]+}/g;
    return [...new Set(content.match(pattern) || [])];
  }
}
export const db = new FillGoDB();
