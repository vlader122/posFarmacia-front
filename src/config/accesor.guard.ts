import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../app/services/auth.service";

export const AccesorGuard: CanActivateFn = (route, state) => {
    const _authService = inject(AuthService);
    const _ruta = inject(Router);
    const _token = _authService.getToken();

    if(!_token){
        sessionStorage.clear();
        _ruta.navigateByUrl('/login');
        return false;
    } else{
        return true;
    }
}
