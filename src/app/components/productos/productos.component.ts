import { Component, OnInit } from '@angular/core';
import { Productos } from '../../models/Productos';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductosService } from '../../services/productos.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { Categorias } from '../../models/Categorias';
import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-productos',
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
  templateUrl: './productos.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ProductosComponent implements OnInit {
    datos: any;
    producto: Productos = new Productos;
    categorias: any;
    productoModal: boolean = false;
    formulario: FormGroup;
    operacion: string = "guardar";
    totalRecords: number = 0;
    loading: boolean = true;

    constructor (
        private _productosService: ProductosService,
        private _categoriasService: CategoriasService,
        private _confirmationService : ConfirmationService,
        private _messageService: MessageService,
    ){
        this.formulario = new FormGroup({
            descripcion: new FormControl('',[Validators.required]),
            cantidad: new FormControl('', Validators.required),
            precio: new FormControl('', Validators.required),
            categoriaId: new FormControl('', [Validators.required])
        })
    }
    ngOnInit(): void {
        this.fproductos();
        this.fcategorias();
    }

    fproductos() {
        this._productosService.obtenerProductos().subscribe(data =>{
            this.datos = data;
        })
    }

    fcategorias(){
        this._categoriasService.obtenerCategorias().subscribe(data =>{
            this.categorias = data;
            console.log(this.categorias.dato);

        })
    }

    enviarDatos(){
        this.producto.Descripcion = this.formulario.value.descripcion;
        this.producto.Cantidad = this.formulario.value.cantidad;
        this.producto.Precio = this.formulario.value.precio;
        this.producto.CategoriaId = this.formulario.value.categoriaId;

        if(this.operacion === "guardar" ){
            this._productosService.guardarProducto(this.producto).subscribe(data =>{
                this._messageService.add({ severity: 'success', summary: 'Guardado Correcto', detail: 'CORRECTO' });
                this.productoModal = false;
                this.formulario.reset();
            })
        } else{
            this._productosService.actualizarProducto(this.producto).subscribe(data =>{
                this._messageService.add({ severity: 'info', summary: 'Guardado Correcto', detail: 'Se actualizo el producto' });
                this.productoModal = false;
                this.formulario.reset();
            })
        }
    }

    mostrarFormulario(){
        this.productoModal = true;
    }

    editarFormulario(producto: any){
        this.operacion = "actualizar"
        this.productoModal = true;
        this.formulario.patchValue({
            nombres: producto.nombres,
            apellidos: producto.apellidos,
            direccion: producto.direccion,
            telefono: producto.telefono
        })
        this.producto.ProductoId = producto['productoId'];
    }

    eliminarProducto(id: number){
        this._confirmationService.confirm({
            message: 'esta seguro de eliminar el producto ' + id + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._productosService.eliminarProducto(id).subscribe( data =>{
                    this.fproductos();
                });
                this._messageService.add({
                    severity: 'success',
                    summary: 'Correcto',
                    detail: 'Producto Eliminado',
                    life: 3000
                });
            }
        });
    }

    loadData(event: TableLazyLoadEvent) {
        this.loading = true;

        const nroPagina = (((event.first || 0) / (event.rows || 10)) * 1) + 1;

        const tamanio = event.rows || 10;

        this._productosService.obtenerProductos(tamanio, nroPagina).subscribe({
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
