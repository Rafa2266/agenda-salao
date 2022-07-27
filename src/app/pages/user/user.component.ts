import { UserCreateComponent } from './user-create/user-create.component';
import { UserService } from 'src/app/services/UserService.service';
import { User, UserTipo, UserToCreate } from './../../models/User';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  isLoading = false;
  isEdit=false;
  users = new Array<User>();
  userTipos = new Array<UserTipo>();
  userToEdit=new User();
  @ViewChild("userCreate") userCreateModal: ModalDirective;
  @ViewChild("userCreateComponent") userCreateComponent: UserCreateComponent;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loadUserTipos();
    this.loadUsers();
  }
  loadUsers() {
    this.userService.userList().subscribe(
      (response) => {
        this.isLoading = false;
        Object.assign(this.users, response);
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }
  loadUserTipos() {
    this.userService.userTypeList().subscribe(
      (response) => {
        Object.assign(this.userTipos, response);
        let userTipoNulo= new UserTipo();
        userTipoNulo.Nome='--Selecionar--';
        userTipoNulo.id=-1;
        this.userTipos.push(userTipoNulo);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  editUser(user:User){
    this.isLoading=true;
    this.isEdit=false;
    this.userToEdit=new User();
    this.userService.userEdit(user).subscribe((response:User)=>{
      Swal.fire(
        "Success",
        "Usuário " + response.Nome + " editado com sucesso",
        "success"
      );
      this.loadUsers();
    },err=>{
      this.isLoading=false;
      Swal.fire(
        "Error",
        "Alguma coisa deu errado salvando o usuário",
        "error"
      );
     })

  }
  deleteUser(user:User){
   Swal.fire({ 
    //'warning',
    title:"Tem certeza?",
    text:`Você está prestes a deletar o usuário ${user.Nome}`,
    showCancelButton: true,
   }).then(result=>{
     if(result.value){
       this.isLoading=true;
       this.userService.userDelete(user).subscribe(rsponse=>{
        this.isLoading=false;
        Swal.fire(
          "Success",
          "Usuário deletado com sucesso",
          "success"
        );
        this.users.splice(this.users.indexOf(user),1);
       })
       
     }
   },err=>{
    this.isLoading=false;
    Swal.fire(
      "Error",
      "Alguma coisa deu errado deletando o usuário",
      "error"
    );
   })

  }
  createUser(user:UserToCreate){
       this.isLoading=true;
       this.userService.userCreate(user).subscribe((res:User)=>{
        Swal.fire(
          "Success",
          "Usuário " + res.Nome + " criado com sucesso",
          "success"
        );
        this.loadUsers();
       },err=>{
        this.isLoading=false;
        Swal.fire(
          "Error",
          "Alguma coisa deu errado salvando o usuário",
          "error"
        );
       })
  }
  findUserTipo(id:number){
    return this.userTipos.find((r) => r.id == id).Nome
  }
   

  showCreateModal(id){
    if(id){
      Object.assign(this.userToEdit,this.users.find(r=>{ return r.id==id}))
      this.isEdit=true;
      this.userCreateComponent.setFormToEdit();
    }else{
      this.isEdit=false;
      this.userCreateComponent.setFormToCreate();

    }
    this.userCreateModal.show();
    this.userCreateModal.config.ignoreBackdropClick=true;
  }
}


