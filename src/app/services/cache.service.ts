import { HttpResponse, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  private cache = new Map<string, any>();

  constructor() { }

  get(url: string): any {
    return this.cache.get(url);
  }

  set(url: string, response: any): void {
    this.cache.set(url, response);
  }

  has(url: string): boolean {
    return this.cache.has(url);
  }
}
