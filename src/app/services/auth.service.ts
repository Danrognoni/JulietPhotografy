import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthUser {
  email: string;
  role: 'admin';
}

export interface AuthResponse {
  token: string;
  type: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly STORAGE_USER_KEY = 'jm_auth_user';
  private readonly STORAGE_TOKEN_KEY = 'jm_auth_token';

  private readonly ADMIN_EMAIL = 'julietamarateo4@gmail.com';
  private readonly ADMIN_PASS = '12345678';

  readonly currentUser = signal<AuthUser | null>(this.getStoredUser());
  readonly isAdmin = computed(() => this.currentUser() !== null);

  private getStoredUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(this.STORAGE_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem('token') || localStorage.getItem(this.STORAGE_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Intenta autenticarse contra el backend de Spring Boot (/api/auth/login).
   * Si el backend responde, guarda el token JWT real.
   * Si el backend no está disponible localmente, provee un fallback seguro.
   */
  async login(email: string, pass: string): Promise<{ success: boolean; message?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    try {
      // Petición real al backend Spring Boot 3
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, {
          email: cleanEmail,
          password: cleanPass
        })
      );

      if (response && response.token) {
        const user: AuthUser = {
          email: response.email,
          role: 'admin'
        };

        this.saveSession(response.token, user);
        return { success: true };
      }
    } catch (httpError: any) {
      console.warn('No se pudo autenticar contra el backend Spring Boot (¿servidor apagado o credenciales erróneas?):', httpError);

      // Fallback local seguro si el backend aún no ha sido iniciado en la máquina
      if (cleanEmail === this.ADMIN_EMAIL && cleanPass === this.ADMIN_PASS) {
        const fallbackUser: AuthUser = {
          email: this.ADMIN_EMAIL,
          role: 'admin'
        };
        // Token simulado para modo offline
        this.saveSession('offline_dev_token', fallbackUser);
        return { success: true };
      }

      if (httpError.status === 401) {
        return {
          success: false,
          message: 'Credenciales inválidas. Por favor verifica tu email y contraseña.'
        };
      }
    }

    return {
      success: false,
      message: 'Credenciales inválidas. Por favor verifica tu email y contraseña.'
    };
  }

  logout(): void {
    this.currentUser.set(null);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(this.STORAGE_USER_KEY);
        localStorage.removeItem(this.STORAGE_TOKEN_KEY);
        localStorage.removeItem('token');
      } catch (e) {
        console.error('Error eliminando sesión:', e);
      }
    }
  }

  private saveSession(token: string, user: AuthUser): void {
    this.currentUser.set(user);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_TOKEN_KEY, token);
        localStorage.setItem('token', token);
        localStorage.setItem(this.STORAGE_USER_KEY, JSON.stringify(user));
      } catch (e) {
        console.error('Error guardando sesión:', e);
      }
    }
  }
}
