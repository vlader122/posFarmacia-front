import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { CategoriasService } from '../../services/categorias.service';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Categorias } from '../../models/Categorias';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-categorias',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ToolbarModule,
    ButtonModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    RatingModule,
    TagModule,
    DialogModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    ToastModule
],

  templateUrl: './categorias.component.html',
  providers: [ConfirmationService, MessageService]
})
export class CategoriasComponent implements OnInit{
    datos: any;
    categoria: Categorias = new Categorias;
    categoriaModal: boolean = false;
    formulario: FormGroup;
    operacion: string = "guardar";
    totalRecords: number = 0;
    loading: boolean = true;

    constructor (
        private _categoriasService:CategoriasService,
        private _confirmationService : ConfirmationService,
        private _messageService: MessageService,
    ){
        this.formulario = new FormGroup({
            descripcion: new FormControl('',[Validators.required])
        })
    }
    ngOnInit(): void {
        this.fcategorias();
    }

    fcategorias() {
        this._categoriasService.obtenerCategorias().subscribe(data =>{
            this.datos = data;
        })
    }

    enviarDatos(){
        this.categoria.Descripcion = this.formulario.value.descripcion;

        if(this.operacion === "guardar" ){
            this._categoriasService.guardarCategoria(this.categoria).subscribe(data =>{
                this._messageService.add({ severity: 'success', summary: 'Guardado Correcto', detail: 'CORRECTO' });
                this.categoriaModal = false;
                this.formulario.reset();
                this.fcategorias();
            })
        } else{
            this._categoriasService.actualizarCategoria(this.categoria).subscribe(data =>{
                this._messageService.add({ severity: 'info', summary: 'Guardado Correcto', detail: 'Se actualizo el categoria' });
                this.categoriaModal = false;
                this.formulario.reset();
                this.fcategorias();
            })
        }

        // const errors: { [key: string]: any } = {};
        // Object.keys(this.formulario.controls).forEach((controlName) => {
        //   const control = this.formulario.controls[controlName];
        //   if (control.errors) {
        //     errors[controlName] = control.errors;
        //   }
        // });
        // console.log(errors);
    }

    mostrarFormulario(){
        this.categoriaModal = true;
    }

    editarFormulario(categoria: any){
        this.operacion = "actualizar"
        this.categoriaModal = true;
        this.formulario.patchValue({
            descripcion: categoria.descripcion
        })
        this.categoria.CategoriaId = categoria['categoriaId'];
    }

    eliminarCategoria(id: number){
        this._confirmationService.confirm({
            message: 'esta seguro de eliminar el categoria ' + id + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._categoriasService.eliminarCategoria(id).subscribe( data =>{
                    this.fcategorias();
                });
                this._messageService.add({
                    severity: 'success',
                    summary: 'Correcto',
                    detail: 'Categoria Eliminado',
                    life: 3000
                });
            }
        });
    }

    loadData(event: TableLazyLoadEvent) {
        this.loading = true;

        const nroPagina = (((event.first || 0) / (event.rows || 10)) * 1) + 1;

        const tamanio = event.rows || 10;

        this._categoriasService.obtenerCategorias(tamanio, nroPagina).subscribe({
            next: (data) =>{
                this.datos = data;
                this.totalRecords = this.datos['totalRegistros'];
                this.loading = false;
            },
            error: (err) => {
                console.log("Error al cargar datos", err);
            }
        })
    }
}
