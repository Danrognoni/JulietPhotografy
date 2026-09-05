import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Interceptor funcional de Angular que adjunta automáticamente el token JWT
 * (leído de localStorage) en la cabecera Authorization: Bearer <token>
 * para todas las peticiones POST, PUT y DELETE hacia la API.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService, { optional: true });

  // 1. Obtener el token JWT directamente de localStorage de forma segura (compatible con SSR)
  let token: string | null = null;
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      token =
        localStorage.getItem('token') ||
        localStorage.getItem('jm_auth_token') ||
        localStorage.getItem('jwt_token') ||
        localStorage.getItem('jwt');
    } catch (e) {
      console.warn('[AuthInterceptor] Error accediendo a localStorage:', e);
    }
  }

  // Fallback a AuthService si existe
  if (!token && authService) {
    token = authService.getToken();
  }

  const method = req.method.toUpperCase();
  const isTargetMutationMethod = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);
  const isApiRequest = req.url.includes('/api/') || req.url.startsWith(environment.apiUrl);

  // 2. Si hay token y la petición se dirige a la API, adjuntamos Bearer en Authorization
  let requestToSend = req;
  if (token && isApiRequest && !req.headers.has('Authorization')) {
    requestToSend = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token.trim()}`
      }
    });
  }

  // 3. Procesar la petición y capturar errores de conexión, CORS y 403 Forbidden
  return next(requestToSend).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        console.error(
          `[AuthInterceptor] Error de conexión o CORS al ejecutar ${method} en ${req.url}. ` +
          `Verifica que el backend Spring Boot esté corriendo en http://localhost:8080 y permita orígenes cruzados.`
        );
      } else if (error.status === 403) {
        console.error(
          `[AuthInterceptor] 403 Forbidden al ejecutar ${method} en ${req.url}: ` +
          `Acceso denegado. El token JWT no cuenta con permisos ROLE_ADMIN o ha expirado.`
        );
      } else if (error.status === 401) {
        console.error(
          `[AuthInterceptor] 401 Unauthorized al ejecutar ${method} en ${req.url}: ` +
          `Sesión no válida o credenciales incorrectas.`
        );
      }

      return throwError(() => error);
    })
  );
};

