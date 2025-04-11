import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clientes } from '../models/Clientes';
@Injectable({
  providedIn: 'root'
})
export class ClientesService {
    ruta = environment.ruta + '/api/cliente';

    constructor(
        private _httpClient:HttpClient
    ){

    }

    obtenerClientes(tamanio: number = 10,pagina: number = 1): Observable<any[]> {
        return this._httpClient.get<any[]>(this.ruta + '?tamañoPagina='+ tamanio+'&numeroPagina='+pagina);
    }

    guardarCliente(cliente: Clientes): Observable<any>{
        return this._httpClient.post<void>(this.ruta, cliente);
    }

    actualizarCliente(cliente: Clientes): Observable<any>{
        return this._httpClient.put<void>(this.ruta, cliente);
    }

    eliminarCliente(id:number): Observable<any>{
        return this._httpClient.delete<any>(this.ruta + '/'+id);
    }
}
