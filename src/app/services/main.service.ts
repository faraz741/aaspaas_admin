import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  // apiUrl = 'http://192.168.29.241:4000/';
  // apiUrl = 'http://52.204.188.107:4000/';
  apiUrl = 'https://ap-south-1.aws.data.mongodb-api.com/app/application-0-dgcxhrt/endpoint/';

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

  getReqApi(endpoint: string): string {
    const apiUrl = 'https://ap-south-1.aws.data.mongodb-api.com/app/application-0-dgcxhrt/endpoint/';
    return `${apiUrl}${endpoint}`;
  }

  // gdeleteApi(url:any):Observable<any>{
  //   return this.http.delete(this.apiUrl + url )
  // };
  
  postAPI(url:any, data:any):Observable<any>{
    return this.http.post(this.apiUrl + url ,data )
  };
  areapostAPI(url:any, data:any):Observable<any>{
       // Define the cookies in a string format
       const cookies = '_abck=DE1CFA3131A2D013E0850473CA66E72C~-1~YAAQZ13SF6giYmSRAQAABEQRiwyU5tdN5L2/zXHJjt93VZKiNnG8Y9ZWJ8N0Pl8p5takiXiaFuVj2mEuplufLY8gtvk0Hz2uUVB++Z085CawWvLFb4zOXNur2QnlqqLlVrYrMJNyXpdGRuyZn0ImNLHTyWyogyQGSiyV8yj2mb33RZRurwOaIncrZl9wFmosC/GL9tHX6neHgXWNmOhaIa14mKjD7yH7HcVN3pdt/Vf2xSxhiXYcf7T6ifoCuPw0sX3vHdfK7rmuptwR7AQO3DLmuHe2dox1weoCFimNUtW6UsyEf0jEZMCt/NBPEWqyirb8t+Id9no0pT7XLWVYX/s9cWa7R8uPt4k87BmPj3rIREmix+qJULHLjh7M9WIR/X4elHEvrNVwCqBpgIzqkRUkhDFCq0MXSmrKoQ==~-1~-1~-1; ak_bmsc=83D69CAAE1F2783F984D6E0C2096D0ED~000000000000000000000000000000~YAAQZ13SF6kiYmSRAQAABEQRixhKAqiKKgeAc2g/Y9+bG7T4D24Wdj3yWo+hOzePfYh1bCu7XjmIwbBor5vpHcb9nfePNdS+gFqhiQhmfAnofiQnvA5+kz8h2N/98URnhExkQWOLAlynFSYtNBNjXOiicjk8JM7M4JAic1RxYXu+dEF1DEKpyTqtU7WXkAiqA79oLZnSqeyApkQc9c8rAcC6E4JpONV+AC4T4onL/Q2jRjfIS2I6pJJ5d5mY9KWheGxbqY72fL35eme/cXd4v6dDK+zUJIqGUCjynq+3l2oflIQhdiGQHB5afkJBl7B4ABeQShO1Vh7jbzbwITKpmfiOEvlwPW/FM0FhcYePMJlmzI+kmU/W7cE0DqocFe4=; bm_sz=AF32B64EE458D608C32F5B17551B9CB2~YAAQZ13SF6oiYmSRAQAABEQRixgSYEONUC9s1CMX2J9Dlyl6zdMx1sFZ5qqwG+mvuu5UJiziBDgOrqxs6CckR4tNtXGHbJyJxrrZ6QWz7R69CXRLuzoR0KHHPjBThDq6Wuw9JgJOh/LTTBBqjY2bsvYPojcJmVrAJnv+M/7gNMiPA1398xrbZ1EzeJpzYLDc8IuWg+8r1p5BPbd4/inNYrCGNX3p+Al4FK19pjkJZAwDWwXC1qtRQJadJqPNc4tkOiOMJVxaa0QqyHzIwMB0/7FtK+6zaP2fjg5UC2M4FHT/3Gd0wT7vRen8M0cdFEpXsW+b7BHmGrZDSLYIC/K6RbGigSqj3hOJYKedZrAU+g==~3486261~4471088; Ak_City=BHOPAL; Continent=AS';

       // Set headers including cookies
       const headers = new HttpHeaders({
         'Content-Type': 'application/json',
         'Cookie': cookies, // Include cookies here
         // Add other required headers here
       });
    return this.http.post(url ,data, { headers } )
  };
  
}
