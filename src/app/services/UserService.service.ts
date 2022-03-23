import { UserLogin } from 'src/app/models/User';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root'
  })
  export class UserService{
      private readonly API= `${environment.API}/`;
      constructor(protected http: HttpClient) {}
      
      checkLogin(user:UserLogin){
        return this.http
        .post(`${this.API}check_login`,user)
        .pipe();
      }
  }