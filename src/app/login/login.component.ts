import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
    private email: string = '';
    private password: string = '';

    token:string = environment.token;

    formulario: FormGroup;

    constructor(
        private _authService: AuthService,
        private _router: Router
    ){
        this.formulario = new FormGroup({
            email: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required]),
        })
    }

    faceptar(){
        this.email = this.formulario.value.email;
        this.password = this.formulario.value.password;
        this._authService.login(this.email,this.password).subscribe(
            (data: any) => {
                if(data){
                    const token = data["accessToken"];
                    sessionStorage.setItem(this.token, token);
                    this._router.navigateByUrl('/');
                }
            },
            (err) => {
                if(err.status === 0){
                    console.log("error en la coneccion");
                }
                if(err.status === 400){
                    console.log("Credenciales Incorrectos");
                }
            }
        )
    }
}
