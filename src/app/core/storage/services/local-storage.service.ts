import { DOCUMENT } from '@angular/common';
import { inject,Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly storage = inject(DOCUMENT)?.defaultView?.localStorage;

  getItem<T>(key: string): T | null {
    try {
      const item = this.storage?.getItem(key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch {
      console.error(`Failed to parse localStorage item: ${key}`);
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      this.storage?.setItem(key, JSON.stringify(value));
    } catch {
      console.error(`Failed to save item to localStorage: ${key}`);
    }
  }

  removeItem(key: string): void {
    this.storage?.removeItem(key);
  }

  clear(): void {
    this.storage?.clear();
  }
}
