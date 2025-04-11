import { Routes } from '@angular/router';
import { Empty } from '../pages/empty/empty';
import { ClientesComponent } from './clientes/clientes.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { ProductosComponent } from './productos/productos.component';
import { VentasComponent } from './ventas/ventas.component';

export default [
    { path: 'empty', component: Empty },
    { path: 'clientes', data: { breadcrumb: 'Clientes' }, component: ClientesComponent },
    { path: 'categorias', data: { breadcrumb: 'Categorias' }, component: CategoriasComponent },
    { path: 'productos', data: { breadcrumb: 'Productos' }, component: ProductosComponent },
    { path: 'ventas', data: { breadcrumb: 'Ventas' }, component: VentasComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
