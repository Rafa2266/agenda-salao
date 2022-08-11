import { Cliente } from './../models/Cliente';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root'
  })
  export class ClienteService{
      private readonly API= `${environment.API}/`;
      constructor(protected http: HttpClient) {}
      
      clienteList(){
        return this.http
        .get(`${this.API}list_clientes`)
        .pipe();
      }
      clienteCreate(cliente:Cliente){
        return this.http
        .post(`${this.API}create_cliente`,cliente)
        .pipe();
      }
      clienteEdit(cliente:Cliente){
        return this.http
        .put(`${this.API}edit_cliente`,cliente)
        .pipe();
      }
      clienteDelete(cliente:Cliente){
        return this.http
        .put(`${this.API}delete_cliente`,cliente)
        .pipe();
      }

  }