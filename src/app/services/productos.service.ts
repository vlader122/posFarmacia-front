import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Productos } from '../models/Productos';
@Injectable({
  providedIn: 'root'
})
export class ProductosService {
    ruta = environment.ruta + '/api/producto';

    constructor(
        private _httpClient:HttpClient
    ){

    }

    obtenerProductos(tamanio: number = 10,pagina: number = 1): Observable<any[]> {
        return this._httpClient.get<any[]>(this.ruta + '?tamañoPagina='+ tamanio+'&numeroPagina='+pagina);
    }

    guardarProducto(producto: Productos): Observable<any>{
        return this._httpClient.post<void>(this.ruta, producto);
    }

    actualizarProducto(producto: Productos): Observable<any>{
        return this._httpClient.put<void>(this.ruta, producto);
    }

    eliminarProducto(id:number): Observable<any>{
        return this._httpClient.delete<any>(this.ruta + '/'+id);
    }
}
