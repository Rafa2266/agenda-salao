import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Servico } from './../../../models/Servico';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'servico-create',
  templateUrl: './servico-create.component.html',
  styleUrls: ['./servico-create.component.scss']
})
export class ServicoCreateComponent implements OnInit {

  @Output() onCloseModal = new EventEmitter<void>();
  @Output() onCreateServico = new EventEmitter<Servico>();
  @Output() onEditServico = new EventEmitter<Servico>();
  @Input() isEdit;
  @Input() servicoToEdit:Servico 
  servicoToCreate= new Servico();
  formServico: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.setFormToCreate()
  }
  setFormToCreate(){
   
    this.formServico=this.formBuilder.group({
      Nome: new FormControl(null, Validators.required),
      Valor_recomendado: new FormControl(null),
      Tempo_recomendado: new FormControl(null),
    })
    
}
setFormToEdit(){
   
  this.formServico=this.formBuilder.group({
    Nome: new FormControl(this.servicoToEdit.Nome, Validators.required),
    Valor_recomendado: new FormControl(this.servicoToEdit.Valor_recomendado),
    Tempo_recomendado: new FormControl(this.servicoToEdit.Tempo_recomendado),
  })
  
}
createServico(){
 if(this.formServico.valid){
    this.servicoToCreate.Nome=this.formServico.value.Nome
    this.servicoToCreate.Valor_recomendado=this.formServico.value.Valor_recomendado
    this.servicoToCreate.Tempo_recomendado=this.formServico.value.Tempo_recomendado
    this.onCreateServico.emit(this.servicoToCreate)
    this.closeModal()
 }
}
editServico(){
if(this.formServico.valid){
     this.servicoToEdit.Nome=this.formServico.value.Nome
     this.servicoToEdit.Valor_recomendado=this.formServico.value.Valor_recomendado
     this.servicoToEdit.Tempo_recomendado=this.formServico.value.Tempo_recomendado
     this.onEditServico.emit(this.servicoToEdit)
     this.closeModal()
  }
 }
  closeModal(){
    this.formServico.reset();
    this.onCloseModal.emit()
}
}
