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
import { ClientesService } from '../../services/clientes.service';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Clientes } from '../../models/Clientes';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-clientes',
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

  templateUrl: './clientes.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ClientesComponent implements OnInit{
    datos: any;
    cliente: Clientes = new Clientes;
    clienteModal: boolean = false;
    formulario: FormGroup;
    operacion: string = "guardar";
    totalRecords: number = 0;
    loading: boolean = true;

    constructor (
        private _clientesService:ClientesService,
        private _confirmationService : ConfirmationService,
        private _messageService: MessageService,
    ){
        this.formulario = new FormGroup({
            nombres: new FormControl('',[Validators.required, Validators.maxLength(5)]),
            apellidos: new FormControl('', Validators.required),
            direccion: new FormControl('', Validators.required),
            telefono: new FormControl('', [Validators.required])
        })
    }
    ngOnInit(): void {
        this.fclientes();
    }

    fclientes() {
        this._clientesService.obtenerClientes().subscribe(data =>{
            this.datos = data;
        })
    }

    enviarDatos(){
        this.cliente.Nombres = this.formulario.value.nombres;
        this.cliente.Apellidos = this.formulario.value.apellidos;
        this.cliente.Direccion = this.formulario.value.direccion;
        this.cliente.Telefono = this.formulario.value.telefono;

        if(this.operacion === "guardar" ){
            this._clientesService.guardarCliente(this.cliente).subscribe(data =>{
                this._messageService.add({ severity: 'success', summary: 'Guardado Correcto', detail: 'CORRECTO' });
                this.clienteModal = false;
                this.formulario.reset();
            })
        } else{
            this._clientesService.actualizarCliente(this.cliente).subscribe(data =>{
                this._messageService.add({ severity: 'info', summary: 'Guardado Correcto', detail: 'Se actualizo el cliente' });
                this.clienteModal = false;
                this.formulario.reset();
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
        this.clienteModal = true;
    }

    editarFormulario(cliente: any){
        this.operacion = "actualizar"
        this.clienteModal = true;
        this.formulario.patchValue({
            nombres: cliente.nombres,
            apellidos: cliente.apellidos,
            direccion: cliente.direccion,
            telefono: cliente.telefono
        })
        this.cliente.ClienteId = cliente['clienteId'];
    }

    eliminarCliente(id: number){
        this._confirmationService.confirm({
            message: 'esta seguro de eliminar el cliente ' + id + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._clientesService.eliminarCliente(id).subscribe( data =>{
                    this.fclientes();
                });
                this._messageService.add({
                    severity: 'success',
                    summary: 'Correcto',
                    detail: 'Cliente Eliminado',
                    life: 3000
                });
            }
        });
    }

    loadData(event: TableLazyLoadEvent) {
        this.loading = true;

        const nroPagina = (((event.first || 0) / (event.rows || 10)) * 1) + 1;

        const tamanio = event.rows || 10;

        this._clientesService.obtenerClientes(tamanio, nroPagina).subscribe({
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
