import { HttpResponse, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor() { }
  private cache = new Map<string, HttpResponse<any>>();

  get(req: any): HttpResponse<any> | undefined {

    return this.cache.get(req.urlWithParams);
  };

  getApisData(url:any){
    return this.cache.get(url);
  }

  put(req: HttpRequest<any>, response: HttpResponse<any>): void {
    this.cache.set(req.urlWithParams, response);
  }

  clear(): void {
    this.cache.clear();
  }
}
