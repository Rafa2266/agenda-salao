import { User, UserToCreate } from './../../../models/User';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {

  @Output() onCloseModal = new EventEmitter<void>();
  @Output() onCreateUser = new EventEmitter<UserToCreate>();
  @Output() onEditUser = new EventEmitter<User>();
  @Input() userTipos;
  @Input() isEdit;
  @Input() userToEdit:User
  formUser: FormGroup;
  userToCreate:UserToCreate =new UserToCreate();
  message:String=null;
  constructor( private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.setFormToCreate();
  }
  setFormToCreate(){
   
      this.formUser=this.formBuilder.group({
        email: new FormControl(null, [Validators.required,Validators.email]),
        password: new FormControl(null, Validators.required),
        confirm_password: new FormControl(null, Validators.required),
        Nome: new FormControl(null, Validators.required),
        Telefone: new FormControl(null,Validators.pattern('^(\\([0-9]{2}\\))\\s([9]{1})?([0-9]{4})-([0-9]{4})$')),
        id_tipo: new FormControl(-1, [Validators.required,Validators.min(0)]),
        cpf: new FormControl(null, [Validators.required ,Validators.pattern(/^(\d{3}\.){2}\d{3}\-\d{2}$/)])
      })
      
  }
  setFormToEdit(){
    
    this.formUser=this.formBuilder.group({
      email: new FormControl(this.userToEdit.Email, [Validators.required,Validators.email]),
      password: new FormControl(null),
      confirm_password: new FormControl(null),
      Nome: new FormControl(this.userToEdit.Nome, Validators.required),
      Telefone: new FormControl(this.userToEdit.Telefone?this.userToEdit.Telefone:null,Validators.pattern('^(\\([0-9]{2}\\))\\s([9]{1})?([0-9]{4})-([0-9]{4})$')),
      id_tipo: new FormControl(this.userToEdit.id_tipo, [Validators.required,Validators.min(0)]),
      cpf: new FormControl(this.userToEdit.CPF, [Validators.required ,Validators.pattern(/^(\d{3}\.){2}\d{3}\-\d{2}$/)])
    })

    
}
  editUser(){
    if(this.formUser.valid){
        this.message=null;
        this.userToEdit.CPF=this.formUser.value.cpf;
        this.userToEdit.Email=this.formUser.value.email;
        this.userToEdit.Nome=this.formUser.value.Nome;
        this.userToEdit.Telefone=this.formUser.value.Telefone?this.formUser.value.Telefone:null;
        this.userToEdit.id_tipo=this.formUser.value.id_tipo;
        this.onEditUser.emit(this.userToEdit);
        this.closeModal();
    }
  }
  createUser(){
    if(this.formUser.valid){
      if(this.formUser.value.password==this.formUser.value.confirm_password){
        this.message=null;
        this.userToCreate.CPF=this.formUser.value.cpf;
        this.userToCreate.Email=this.formUser.value.email;
        this.userToCreate.Nome=this.formUser.value.Nome;
        this.userToCreate.Telefone=this.formUser.value.Telefone?this.formUser.value.Telefone:null;
        this.userToCreate.id_tipo=this.formUser.value.id_tipo 
        this.userToCreate.password=this.formUser.value.password;
        this.onCreateUser.emit(this.userToCreate);
        this.closeModal();
      }else{
            this.message='Password e Confirm Password devem ser iguais.'
      }
    }
  }
  closeModal(){
       this.formUser.reset();
       
       this.onCloseModal.emit()
  }

}
