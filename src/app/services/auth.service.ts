import { Injectable, signal, computed } from '@angular/core';

export interface AuthUser {
  email: string;
  role: 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'jm_auth_user';
  private readonly ADMIN_EMAIL = 'julietamarateo4@gmail.com';
  private readonly ADMIN_PASS = '12345678';

  readonly currentUser = signal<AuthUser | null>(this.getStoredUser());
  readonly isAdmin = computed(() => this.currentUser() !== null);

  private getStoredUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  login(email: string, pass: string): { success: boolean; message?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (cleanEmail === this.ADMIN_EMAIL && cleanPass === this.ADMIN_PASS) {
      const user: AuthUser = {
        email: this.ADMIN_EMAIL,
        role: 'admin'
      };
      this.currentUser.set(user);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        } catch (e) {
          console.error('Error guardando sesión:', e);
        }
      }
      return { success: true };
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
        localStorage.removeItem(this.STORAGE_KEY);
      } catch (e) {
        console.error('Error eliminando sesión:', e);
      }
    }
  }
}
