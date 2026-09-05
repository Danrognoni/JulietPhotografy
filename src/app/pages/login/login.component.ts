import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-aura-mesh flex flex-col justify-between relative py-12 px-4 sm:px-6 lg:px-8">
      
      <!-- Ambient Aura orbs -->
      <div class="fixed top-12 left-1/4 w-[450px] h-[450px] rounded-full aura-orb-teal blur-[130px] pointer-events-none"></div>
      <div class="fixed bottom-12 right-1/4 w-[400px] h-[400px] rounded-full aura-orb-warm blur-[120px] pointer-events-none"></div>

      <!-- Top Header / Back Link -->
      <div class="max-w-md w-full mx-auto flex items-center justify-between z-10">
        <a routerLink="/" class="inline-flex items-center gap-2 text-xs font-semibold text-teal-800 hover:text-teal-950 bg-white/80 px-3.5 py-1.5 rounded-full border border-teal-200/80 backdrop-blur-md transition-all shadow-xs">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          <span>Volver al Portafolio</span>
        </a>

        <span class="text-xs text-slate-500 font-medium">Acceso Privado</span>
      </div>

      <!-- Login Card -->
      <div class="max-w-md w-full mx-auto card-fresh rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl relative z-10 bg-white/95 backdrop-blur-lg">
        
        <!-- Brand Header -->
        <div class="text-center mb-8">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-sky-500 p-[2px] mx-auto shadow-sm mb-4">
            <div class="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-teal-700 font-bold text-xl">
              JM
            </div>
          </div>
          <h2 class="font-display font-bold text-2xl text-slate-900">
            Panel de Administración
          </h2>
          <p class="text-xs text-slate-500 mt-1">
            Inicia sesión para gestionar fotografías, servicios y tu perfil
          </p>
        </div>

        @if (auth.isAdmin()) {
          <!-- Already logged in state -->
          <div class="text-center space-y-4 py-4">
            <div class="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs">
              <span class="font-bold block text-sm mb-1">¡Sesión Activa de Administrador!</span>
              Estás autenticado como <strong>{{ auth.currentUser()?.email }}</strong>
            </div>

            <div class="flex flex-col gap-2.5 pt-2">
              <button
                (click)="goToDashboard()"
                class="w-full btn-fresh-gradient py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                <span>Abrir Dashboard y Portafolio</span>
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>

              <button
                (click)="auth.logout()"
                class="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors">
                Cerrar Sesión
              </button>
            </div>
          </div>
        } @else {
          <!-- Login Form -->
          <form (ngSubmit)="handleLogin()" class="space-y-5">
            
            @if (errorMessage()) {
              <div class="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <svg class="w-4 h-4 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{{ errorMessage() }}</span>
              </div>
            }

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Correo Electrónico
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </span>
                <input
                  type="email"
                  required
                  [(ngModel)]="email"
                  name="email"
                  placeholder="julietamarateo4@gmail.com"
                  class="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white"/>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Contraseña
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type="password"
                  required
                  [(ngModel)]="password"
                  name="password"
                  placeholder="••••••••"
                  class="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white"/>
              </div>
            </div>

            <!-- Quick Auto-Fill helper for ease of demonstration -->
            <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Credenciales predeterminadas</span>
              <button
                type="button"
                (click)="fillDefaultCredentials()"
                class="text-teal-700 font-semibold hover:underline">
                Completar datos
              </button>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full btn-fresh-gradient py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              <span>Ingresar como Administradora</span>
            </button>

          </form>
        }

      </div>

      <!-- Bottom Credits -->
      <div class="text-center text-xs text-slate-400 z-10">
        <p>© 2026 Julieta Marateo · Mar del Plata</p>
      </div>

    </div>
  `
})
export class LoginComponent {
  readonly auth = inject(AuthService);
  readonly shop = inject(ShopService);
  private readonly router = inject(Router);

  email = 'julietamarateo4@gmail.com';
  password = '12345678';
  errorMessage = signal<string>('');

  fillDefaultCredentials(): void {
    this.email = 'julietamarateo4@gmail.com';
    this.password = '12345678';
  }

  async handleLogin(): Promise<void> {
    const result = await this.auth.login(this.email, this.password);
    if (result.success) {
      this.errorMessage.set('');
      this.shop.openAdminDashboard('photos');
      this.router.navigate(['/']);
    } else {
      this.errorMessage.set(result.message || 'Error al iniciar sesión');
    }
  }

  goToDashboard(): void {
    this.shop.openAdminDashboard('photos');
    this.router.navigate(['/']);
  }
}
