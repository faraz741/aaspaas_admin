import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  // apiUrl = 'http://192.168.29.241:4000/';
  apiUrl = 'http://52.204.188.107:4000/';

  constructor(private http: HttpClient) { }

  setToken(token: string) {
    localStorage.setItem('token', token)
  }

  getToken() {
    return localStorage.getItem('token')
  }

  getApi(url:any):Observable<any>{
    return this.http.get(this.apiUrl + url )
  };

  // gdeleteApi(url:any):Observable<any>{
  //   return this.http.delete(this.apiUrl + url )
  // };
  
  postAPI(url:any, data:any):Observable<any>{
    return this.http.post(this.apiUrl + url ,data )
  };
  
}
