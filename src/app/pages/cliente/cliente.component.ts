import Swal from 'sweetalert2';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ClienteCreateComponent } from './cliente-create/cliente-create.component';
import { ClienteService } from './../../services/ClienteService.service';
import { Cliente } from './../../models/Cliente';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {
  
  isLoading = false;
  isEdit=false;
  clientes = new Array<Cliente>();
  clienteToEdit=new Cliente();
  @ViewChild("clienteCreate") clienteCreateModal: ModalDirective;
  @ViewChild("clienteCreateComponent") clienteCreateComponent:ClienteCreateComponent;

  constructor(private clienteService:ClienteService) { }

  ngOnInit(): void {
    this.isLoading=true;
    this.loadClientes()
  }
  loadClientes() {
    this.clienteService.clienteList().subscribe(
      (response) => {
        this.isLoading = false;
        Object.assign(this.clientes, response);
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }
  showCreateModal(id){
    if(id){
      Object.assign(this.clienteToEdit,this.clientes.find(r=>{ return r.id==id}))
      this.isEdit=true;
      this.clienteCreateComponent.setFormToEdit();
    }else{
      this.isEdit=false;
      this.clienteCreateComponent.setFormToCreate();

    }
    this.clienteCreateModal.show();
    this.clienteCreateModal.config.ignoreBackdropClick=true;
  }

createCliente(cliente:Cliente){
  this.isLoading=true;
  this.clienteService.clienteCreate(cliente).subscribe((res:Cliente)=>{
   Swal.fire(
     "Success",
     "Cliente " + res.Nome + " registrado com sucesso",
     "success"
   );
   this.loadClientes();
  },err=>{
   this.isLoading=false;
   Swal.fire(
     "Error",
     "Alguma coisa deu errado salvando o cliente",
     "error"
   );
  })
}
editCliente(cliente:Cliente){
  this.isLoading=true;
  this.clienteService.clienteEdit(cliente).subscribe((res:Cliente)=>{
   Swal.fire(
     "Success",
     "Cliente " + res.Nome + " editado com sucesso",
     "success"
   );
   this.loadClientes();
  },err=>{
   this.isLoading=false;
   Swal.fire(
     "Error",
     "Alguma coisa deu errado salvando o cliente",
     "error"
   );
  })
}

  deleteCliente(cliente:Cliente){
    Swal.fire({ 
      //'warning',
      title:"Tem certeza?",
      text:`Você está prestes a deletar o usuário ${cliente.Nome}`,
      showCancelButton: true,
     }).then(result=>{
       if(result.value){
         this.isLoading=true;
         this.clienteService.clienteDelete(cliente).subscribe(rsponse=>{
          this.isLoading=false;
          Swal.fire(
            "Success",
            "Cliente deletado com sucesso",
            "success"
          );
          this.clientes.splice(this.clientes.indexOf(cliente),1);
         })
         
       }
     },err=>{
      this.isLoading=false;
      Swal.fire(
        "Error",
        "Alguma coisa deu errado deletando o cliente",
        "error"
      );
     })
  }

}
