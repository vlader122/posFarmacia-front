import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categorias } from '../models/Categorias';
@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
    ruta = environment.ruta + '/api/categoria';

    constructor(
        private _httpClient:HttpClient
    ){

    }

    obtenerCategorias(tamanio: number = 10,pagina: number = 1): Observable<any[]> {
        return this._httpClient.get<any[]>(this.ruta + '?tamañoPagina='+ tamanio+'&numeroPagina='+pagina);
    }

    guardarCategoria(categoria: Categorias): Observable<any>{
        return this._httpClient.post<void>(this.ruta, categoria);
    }

    actualizarCategoria(categoria: Categorias): Observable<any>{
        return this._httpClient.put<void>(this.ruta, categoria);
    }

    eliminarCategoria(id:number): Observable<any>{
        return this._httpClient.delete<any>(this.ruta + '/'+id);
    }
}
