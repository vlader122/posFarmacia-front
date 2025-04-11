import { HttpInterceptorFn } from "@angular/common/http";
import { AuthService } from "../app/services/auth.service";
import { inject } from "@angular/core";

export const AccesorInterceptor: HttpInterceptorFn = (request, next) => {
    const _authService = inject(AuthService);
    const token = _authService.getToken();

    if(!request.url.includes('/login') && token){
        const requestConToken = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            }
        });

        return next(requestConToken);
    } else {
        return next(request);
    }
}
