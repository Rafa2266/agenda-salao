import { UserToCreate, User } from './../models/User';
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
      userList(){
        return this.http
        .get(`${this.API}list_users`)
        .pipe();
      }
      userTypeList(){
        return this.http
        .get(`${this.API}list_tipo_users`)
        .pipe();
      }
      userCreate(user:UserToCreate){
        return this.http
        .post(`${this.API}create_user`,user)
        .pipe();
      }
      userEdit(user:User){
        return this.http
        .put(`${this.API}edit_user`,user)
        .pipe();
      }
      userDelete(user:User){
        return this.http
        .put(`${this.API}delete_user`,user)
        .pipe();
      }

  }