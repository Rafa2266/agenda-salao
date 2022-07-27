import { ServicoCreateComponent } from './servico-create/servico-create.component';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ServicoService } from './../../services/ServicoService.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Servico } from 'src/app/models/Servico';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-servico',
  templateUrl: './servico.component.html',
  styleUrls: ['./servico.component.scss'],
})
export class ServicoComponent implements OnInit {
  isLoading = false;
  isEdit = false;
  servicos = new Array<Servico>();

  servicoToEdit = new Servico();
  @ViewChild('servicoCreate') servicoCreateModal: ModalDirective;
  @ViewChild('servicoCreateComponent')
  servicoCreateComponent: ServicoCreateComponent;

  constructor(private servicoService: ServicoService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loadServicos();
  }

  loadServicos() {
    this.servicoService.servicoList().subscribe(
      (response) => {
        this.isLoading = false;
        Object.assign(this.servicos, response);
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }
  createServico(servico: Servico) {
    this.isLoading = true;
    this.servicoService.servicoCreate(servico).subscribe(
      (res: Servico) => {
        Swal.fire(
          'Success',
          'Serviço ' + res.Nome + ' criado com sucesso',
          'success'
        );
        this.loadServicos();
      },
      (err) => {
        this.isLoading = false;
        Swal.fire(
          'Error',
          'Alguma coisa deu errado salvando o serviço',
          'error'
        );
      }
    );
  }
  editServico(servico: Servico) {
    this.isLoading = true;
    this.isEdit=false;
    this.servicoToEdit=new Servico();
    this.servicoService.servicoEdit(servico).subscribe(
      (res: Servico) => {
        Swal.fire(
          'Success',
          'Serviço ' + res.Nome + ' editado com sucesso',
          'success'
        );
        this.loadServicos();
      },
      (err) => {
        this.isLoading = false;
        Swal.fire(
          'Error',
          'Alguma coisa deu errado salvando o serviço',
          'error'
        );
      }
    );
  }
  deleteServico(servico:Servico){
    Swal.fire({ 
      //'warning',
      title:"Tem certeza?",
      text:`Você está prestes a deletar o serviço ${servico.Nome}`,
      showCancelButton: true,
     }).then(result=>{
       if(result.value){
         this.isLoading=true;
         this.servicoService.servicoDelete(servico).subscribe(rsponse=>{
          this.isLoading=false;
          Swal.fire(
            "Success",
            "Serviço deletado com sucesso",
            "success"
          );
          this.servicos.splice(this.servicos.indexOf(servico),1);
         })
         
       }
     },err=>{
      this.isLoading=false;
      Swal.fire(
        "Error",
        "Alguma coisa deu errado deletando o serviço",
        "error"
      );
     })
  }
  showCreateModal(id) {
    if (id) {
      Object.assign(
        this.servicoToEdit,
        this.servicos.find((r) => {
          return r.id == id;
        })
      );
      this.isEdit = true;
      this.servicoCreateComponent.setFormToEdit();
    } else {
      this.isEdit = false;
      this.servicoCreateComponent.setFormToCreate();
    }
    this.servicoCreateModal.show();
    this.servicoCreateModal.config.ignoreBackdropClick = true;
  }
}
