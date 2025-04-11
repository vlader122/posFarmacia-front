import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ventas } from '../models/Ventas';
@Injectable({
  providedIn: 'root'
})
export class VentasService {
    ruta = environment.ruta + '/api/venta';

    constructor(
        private _httpClient:HttpClient
    ){

    }

    obtenerVentas(tamanio: number = 10,pagina: number = 1): Observable<any[]> {
        return this._httpClient.get<any[]>(this.ruta + '?tamañoPagina='+ tamanio+'&numeroPagina='+pagina);
    }

    guardarVenta(venta: Ventas): Observable<any>{
        return this._httpClient.post<void>(this.ruta, venta);
    }

    actualizarVenta(venta: Ventas): Observable<any>{
        return this._httpClient.put<void>(this.ruta, venta);
    }

    eliminarVenta(id:number): Observable<any>{
        return this._httpClient.delete<any>(this.ruta + '/'+id);
    }
}
