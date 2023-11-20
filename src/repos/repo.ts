export interface Repository<X extends { id: unknown }> {
  getAll(): Promise<X[]>;
  getById(_id: X['id']): Promise<X>;
  search({ _key, _value }: { _key: string; _value: unknown }): Promise<X[]>;
  create(_newItem: Omit<X, 'id'>): Promise<X>;
  update(_id: X['id'], _updatedItem: Partial<X>): Promise<X>;
  delete(_id: X['id']): Promise<void>;
}
