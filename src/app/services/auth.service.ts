import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    ruta = `${environment.ruta}/login`;

    token: string = environment.token;

    constructor(
        private _httpClient: HttpClient
    ){ }

    login(email: string, password: string){
        const body = { email: email, password: password};

        return this._httpClient.post(this.ruta,body,
            {
                headers: new HttpHeaders().set('Content-Type', 'application/json;charset=UTF-8')
            }
        )
    }

    logout(){
        sessionStorage.clear()
    }

    getToken(){
        let token = sessionStorage.getItem(this.token);
        if(token === null){
            token = ''
        }
        return token;
    }
}
