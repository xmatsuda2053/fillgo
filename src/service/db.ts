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

  /**
   * テンプレートを全権取得します。
   *
   * @return {*}  {Promise<Template[]>}
   * @memberof FillGoDB
   */
  async selectTemplates(): Promise<Template[]> {
    return await db.templates.toArray();
  }

  /**
   * 指定したIDのテンプレートを取得します。
   * @param id
   * @returns
   */
  async selectTemplateById(id: number): Promise<Template | undefined> {
    return await db.templates.get(id);
  }

  /**
   * 指定したIDのテンプレートを更新します。
   * @param id
   * @param t
   */
  async updateTemplate(id: number, t: Template) {
    await db.templates.update(id, {
      title: t.title,
      content: t.content,
      params: t.params,
      categoryId: t.categoryId,
      updatedAt: t.updatedAt,
    });
  }

  /**
   * 指定したIDのテンプレートを複製します。
   *
   * @param {number} id
   * @memberof FillGoDB
   */
  async copyTemplate(id: number) {
    const t: Template | undefined = await this.selectTemplateById(id);
    if (!t) return;

    const copyT: Template = {
      ...t,
      id: undefined,
      title: `copy~${t.title}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.insertTemplate(copyT);
  }

  /**
   * 指定したIDのテンプレートを削除します。
   *
   * @param {number} id
   * @memberof FillGoDB
   */
  async deleteTemplate(id: number) {
    await db.templates.delete(id);
  }
}
export const db = new FillGoDB();
