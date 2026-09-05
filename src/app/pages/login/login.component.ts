import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-aura-mesh flex flex-col justify-between relative py-12 px-4 sm:px-6 lg:px-8 text-slate-100">
      
      <!-- Ambient Aura orbs -->
      <div class="fixed top-12 left-1/4 w-[450px] h-[450px] rounded-full aura-orb-violet blur-[130px] pointer-events-none"></div>
      <div class="fixed bottom-12 right-1/4 w-[400px] h-[400px] rounded-full aura-orb-magenta blur-[120px] pointer-events-none"></div>

      <!-- Top Header / Back Link -->
      <div class="max-w-md w-full mx-auto flex items-center justify-between z-10">
        <a routerLink="/" class="inline-flex items-center gap-2 text-xs font-semibold text-violet-200 hover:text-white bg-[#180b38]/80 px-3.5 py-1.5 rounded-full border border-violet-500/30 backdrop-blur-md transition-all shadow-md">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          <span>Volver al Portafolio</span>
        </a>

        <span class="text-xs text-violet-400 font-medium">Acceso Privado</span>
      </div>

      <!-- Login Card -->
      <div class="max-w-md w-full mx-auto card-fresh rounded-3xl p-8 sm:p-10 border border-violet-500/30 shadow-2xl relative z-10 bg-[#140b2e]/90 backdrop-blur-xl">
        
        <!-- Brand Header -->
        <div class="text-center mb-8">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-500 p-[2px] mx-auto shadow-lg shadow-violet-600/30 mb-4">
            <div class="w-full h-full bg-[#0d071e] rounded-[14px] flex items-center justify-center text-fuchsia-400 font-bold text-xl">
              JM
            </div>
          </div>
          <h2 class="font-display font-bold text-2xl text-white">
            Panel de Administración
          </h2>
          <p class="text-xs text-slate-300 mt-1">
            Inicia sesión para gestionar fotografías, servicios y tu perfil
          </p>
        </div>

        @if (auth.isAdmin()) {
          <!-- Already logged in state -->
          <div class="text-center space-y-4 py-4">
            <div class="p-4 rounded-2xl bg-violet-950/80 border border-violet-600/40 text-violet-200 text-xs shadow-md">
              <span class="font-bold block text-sm text-fuchsia-300 mb-1">¡Sesión Activa de Administradora!</span>
              Estás autenticada como <strong class="text-white">{{ auth.currentUser()?.email }}</strong>
            </div>

            <div class="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                (click)="goToDashboard()"
                class="w-full btn-fresh-gradient py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30">
                <span>Abrir Dashboard y Portafolio</span>
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>

              <button
                type="button"
                (click)="auth.logout()"
                class="w-full py-2.5 rounded-xl border border-violet-700/40 text-xs font-medium text-slate-300 hover:text-rose-400 hover:bg-rose-950/40 transition-colors">
                Cerrar Sesión
              </button>
            </div>
          </div>
        } @else {
          <!-- Login Form -->
          <form (ngSubmit)="handleLogin()" class="space-y-5">
            
            @if (errorMessage()) {
              <div class="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                <svg class="w-4 h-4 text-rose-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{{ errorMessage() }}</span>
              </div>
            }

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-violet-300 mb-1.5">
                Correo Electrónico
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-violet-400">
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
                  class="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-violet-600/40 text-white placeholder-violet-400/40 focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400/30 bg-[#0e0620]"/>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-violet-300 mb-1.5">
                Contraseña
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-violet-400">
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
                  class="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-violet-600/40 text-white placeholder-violet-400/40 focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400/30 bg-[#0e0620]"/>
              </div>
            </div>

            <!-- Quick Auto-Fill helper for ease of demonstration -->
            <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Credenciales predeterminadas</span>
              <button
                type="button"
                (click)="fillDefaultCredentials()"
                class="text-fuchsia-400 font-semibold hover:underline">
                Completar datos
              </button>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full btn-fresh-gradient py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30">
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
      <div class="text-center text-xs text-slate-500 z-10">
        <p>© 2026 Julieta Marateo · Mar del Plata</p>
      </div>

    </div>
  `
})
export class LoginComponent {
  readonly auth = inject(AuthService);
  readonly shop = inject(ShopService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

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
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/crud';
      this.shop.openAdminDashboard('photos');
      this.router.navigateByUrl(returnUrl);
    } else {
      this.errorMessage.set(result.message || 'Error al iniciar sesión');
    }
  }

  goToDashboard(): void {
    this.shop.openAdminDashboard('photos');
    this.router.navigate(['/admin/crud']);
  }
}
