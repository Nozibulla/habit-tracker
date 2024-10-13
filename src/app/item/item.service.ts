import { Injectable } from '@angular/core';
import { Item } from './item';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private items = new Array<Item>(
    { id: 1, title: 'Buy groceries', completed: false },
    { id: 2, title: 'Clean the house', completed: true },
    { id: 3, title: 'Walk the dog', completed: false }
  );

  getItems(): Array<Item> {
    return this.items;
  }

  getItem(id: number): Item {
    return this.items.filter((item) => item.id === id)[0];
  }

  addItem(title: string): void {
    const newId = Math.max(...this.items.map(item => item.id), 0) + 1;
    this.items.push({ id: newId, title, completed: false });
  }

  toggleItemCompletion(id: number): void {
    const item = this.getItem(id);
    if (item) {
      item.completed = !item.completed;
    }
  }
}