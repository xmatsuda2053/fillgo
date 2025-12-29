import Dexie, { Table } from "dexie";

import type { Category } from "@/models/Category";
import type { Template } from "@/models/Template";

export class FillGoDB extends Dexie {
  categorys!: Table<Category>;
  templates!: Table<Template>;

  /**
   * Creates an instance of FillGoDB.
   * @memberof FillGoDB
   */
  constructor() {
    super("FillGoDB");
    this.version(1).stores({
      categorys: "++id, name",
      templates: "++id, title, categoryId, createdAt, updatedAt",
    });
  }

  /**
   * カテゴリ一覧を取得します。
   * @return {*}  {Promise<Category[]>}
   * @memberof FillGoDB
   */
  async selectCategorys(): Promise<Category[]> {
    return await db.categorys.toArray();
  }

  /**
   * カテゴリを規追加します。
   * @param {Category} category
   * @return {*}  {Promise<number>}
   * @memberof FillGoDB
   */
  async insertCategory(category: Category): Promise<number> {
    return await db.categorys.add(category);
  }

  /**
   * カテゴリを削除します。
   * @param id
   */
  async deleteCategory(id: number) {
    db.categorys.delete(id);
  }

  /**
   * テンプレートを新規登録します。
   * @param t
   * @returns
   */
  async insertTemplate(t: Template): Promise<number> {
    return await db.templates.add(t);
  }
}
export const db = new FillGoDB();
