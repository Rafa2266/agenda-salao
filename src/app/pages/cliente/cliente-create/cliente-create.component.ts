import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Cliente } from './../../../models/Cliente';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cliente-create',
  templateUrl: './cliente-create.component.html',
  styleUrls: ['./cliente-create.component.scss'],
})
export class ClienteCreateComponent implements OnInit {
  @Output() onCloseModal = new EventEmitter<void>();
  @Output() onCreateCliente = new EventEmitter<Cliente>();
  @Output() onEditCliente = new EventEmitter<Cliente>();
  @Input() isEdit;
  @Input() clienteToEdit: Cliente;
  formCliente: FormGroup;
  clienteToCreate = new Cliente();
  message: String = null;
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.setFormToCreate();
  }

  setFormToCreate() {
    this.formCliente = this.formBuilder.group({
      email: new FormControl(null, Validators.email),
      Nome: new FormControl(null, Validators.required),
      Telefone: new FormControl(
        null,
        Validators.pattern(
          '^(\\([0-9]{2}\\))\\s([9]{1})?([0-9]{4})-([0-9]{4})$'
        )
      ),
      cpf: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^(\d{3}\.){2}\d{3}\-\d{2}$/),
      ]),
    });
  }

  setFormToEdit() {
    this.formCliente = this.formBuilder.group({
      email: new FormControl(this.clienteToEdit.Email, Validators.email),
      Nome: new FormControl(this.clienteToEdit.Nome, Validators.required),
      Telefone: new FormControl(
        this.clienteToEdit.Telefone,
        Validators.pattern(
          '^(\\([0-9]{2}\\))\\s([9]{1})?([0-9]{4})-([0-9]{4})$'
        )
      ),
      cpf: new FormControl(this.clienteToEdit.CPF, [
        Validators.required,
        Validators.pattern(/^(\d{3}\.){2}\d{3}\-\d{2}$/),
      ]),
    });
  }

  createCliente(){
      if(this.formCliente.valid){
        this.clienteToCreate.CPF=this.formCliente.value.cpf;
        this.clienteToCreate.Email=this.formCliente.value.email;
        this.clienteToCreate.Nome=this.formCliente.value.Nome;
        this.clienteToCreate.Telefone=this.formCliente.value.Telefone;
        this.onCreateCliente.emit(this.clienteToCreate)
        this.closeModal()
      }
  }
  editCliente(){
    if(this.formCliente.valid){
      this.clienteToEdit.CPF=this.formCliente.value.cpf;
      this.clienteToEdit.Email=this.formCliente.value.email;
      this.clienteToEdit.Nome=this.formCliente.value.Nome;
      this.clienteToEdit.Telefone=this.formCliente.value.Telefone;
      this.onEditCliente.emit(this.clienteToEdit)
      this.closeModal()
    }
  }
  closeModal(){
    this.formCliente.reset(); 
    this.onCloseModal.emit()
  }
}
