import Dexie, { Table } from "dexie";

export interface Category {
  id?: number;
  name: string;
}

export class FillGoDB extends Dexie {
  categorys!: Table<Category>;

  /**
   * Creates an instance of FillGoDB.
   * @memberof FillGoDB
   */
  constructor() {
    super("FillGoDB");
    this.version(1).stores({
      categorys: "++id, name",
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
}
export const db = new FillGoDB();
