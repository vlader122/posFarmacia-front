import { Component } from '@angular/core';
import { Ventas } from '../../models/Ventas';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { VentasService } from '../../services/ventas.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ClientesService } from '../../services/clientes.service';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-ventas',
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
    DatePickerModule,
    DividerModule,
    ToastModule
],
    providers:[ConfirmationService, MessageService],
  templateUrl: './ventas.component.html'
})
export class VentasComponent {
    datos: any;
    venta: Ventas = new Ventas;
    ventas: any;
    clientes: any;
    productos: any;
    listaProductos: any[] = [];
    ventaModal: boolean = false;
    formulario: FormGroup;
    formulario2: FormGroup;
    total: number = 0;
    subtotal: number = 0;
    operacion: string = "guardar";
    totalRecords: number = 0;
    loading: boolean = true;

    constructor (
        private _ventasService: VentasService,
        private _clientesService: ClientesService,
        private _productosService: ProductosService,
        private _confirmationService : ConfirmationService,
        private _messageService: MessageService,
    ){
        this.formulario = new FormGroup({
            factura: new FormControl('',[Validators.required]),
            fecha: new FormControl('', Validators.required),
            total: new FormControl('', Validators.required),
            clienteId: new FormControl('', [Validators.required]),
            detalleVentas: new FormControl()
        })

        this.formulario2 = new FormGroup({
            cantidad: new FormControl('',[Validators.required]),
            subtotal: new FormControl('',[Validators.required]),
            productoId: new FormControl('',[Validators.required]),
        })
    }
    ngOnInit(): void {
        this.fventas();
        this.fclientes();
    }

    fventas() {
        this._ventasService.obtenerVentas().subscribe(data =>{
            this.datos = data;
        })
    }

    fclientes(){
        this._clientesService.obtenerClientes().subscribe(data =>{
            this.clientes = data;
        })
    }

    fproductos(){
        this._productosService.obtenerProductos().subscribe(data =>{
            this.productos = data;
        })
    }

    enviarDatos(){
        this.venta = {
            ...this.formulario.value,
            detalleVentas: this.formulario.value.detalleVentas.map((detalle: { productoId: { productoId: any; }; }) => ({
              ...detalle,
              productoId: detalle.productoId.productoId // Solo toma el ID numérico
            }))
          };
        if(this.operacion === "guardar" ){
            this._ventasService.guardarVenta(this.venta).subscribe(data =>{
                this._messageService.add({ severity: 'success', summary: 'Guardado Correcto', detail: 'CORRECTO' });
                this.ventaModal = false;
                this.formulario.reset();
                this.fventas();
            })
        } else{
            this._ventasService.actualizarVenta(this.venta).subscribe(data =>{
                this._messageService.add({ severity: 'info', summary: 'Guardado Correcto', detail: 'Se actualizo el venta' });
                this.ventaModal = false;
                this.formulario.reset();
            })
        }
    }

    mostrarFormulario(){
        this.ventaModal = true;
        this.fproductos();
    }

    editarFormulario(venta: any){
        this.operacion = "actualizar"
        this.ventaModal = true;
        this.formulario.patchValue({
            nombres: venta.nombres,
            apellidos: venta.apellidos,
            direccion: venta.direccion,
            telefono: venta.telefono
        })
        this.venta.VentaId = venta['ventaId'];
    }

    eliminarVenta(id: number){
        this._confirmationService.confirm({
            message: 'esta seguro de eliminar el venta ' + id + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._ventasService.eliminarVenta(id).subscribe( data =>{
                    this.fventas();
                });
                this._messageService.add({
                    severity: 'success',
                    summary: 'Correcto',
                    detail: 'Venta Eliminado',
                    life: 3000
                });
            }
        });
    }

    loadData(event: TableLazyLoadEvent) {
        this.loading = true;

        const nroPagina = (((event.first || 0) / (event.rows || 10)) * 1) + 1;

        const tamanio = event.rows || 10;

        this._ventasService.obtenerVentas(tamanio, nroPagina).subscribe({
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
    calcularSubtotal(){
        this.subtotal = this.formulario2.value.productoId.precio * this.formulario2.value.cantidad
        this.formulario2.patchValue({
            subtotal: this.subtotal
        })
    }
    cargarLista() {
        const producto = this.formulario2.value;
        this.formulario2.patchValue({
            productoId: this.formulario2.value.productoId.productoId
        })
        this.listaProductos.push(producto);
        this.calcularTotal();
        this.formulario.patchValue({
            detalleVentas: this.listaProductos,
            total: this.total
        })
        this.formulario2.reset();
        console.log(this.formulario);
    }

    calcularTotal(){
        this.total = this.total + this.subtotal;
    }
}
