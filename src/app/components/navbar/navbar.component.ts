import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShopService } from '../../services/shop.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="fixed top-0 left-0 w-full z-40 glass-header-aura transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <!-- Editorial Masthead / Signature Logo -->
        <a href="/#inicio" class="flex items-center gap-3 group focus:outline-none">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500/40 via-emerald-400/30 to-sky-400/40 p-[1.5px] shadow-lg shadow-violet-950/50 group-hover:shadow-emerald-500/30 transition-all">
            <div class="w-full h-full bg-[#0d071e] rounded-[14px] flex items-center justify-center">
              <span class="font-editorial text-lg italic font-bold text-emerald-300 group-hover:text-white transition-colors">J</span>
            </div>
          </div>
          <div>
            <span class="font-editorial text-xl sm:text-2xl tracking-[0.2em] uppercase font-semibold text-white flex items-center gap-1.5">
              JULIETA <span class="text-violet-300 font-normal">MARATEO</span>
            </span>
          </div>
        </a>

        <!-- Desktop Navigation Menu: Revel Minimalist Style -->
        <nav class="hidden lg:flex items-center gap-1 bg-[#130a2a]/80 px-4 py-1.5 rounded-full border border-violet-500/20 shadow-inner backdrop-blur-xl">
          <a href="/#inicio"
             class="px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full text-slate-300 hover:text-white hover:bg-violet-600/25 transition-all">
            Inicio
          </a>
          <a href="/#albumes"
             class="px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full text-slate-300 hover:text-emerald-300 hover:bg-emerald-500/15 transition-all">
            Álbumes
          </a>
          <a href="/#galeria"
             class="px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full text-slate-300 hover:text-sky-300 hover:bg-sky-500/15 transition-all">
            Portafolio
          </a>
          <a href="/#servicios"
             class="px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full text-slate-300 hover:text-white hover:bg-violet-600/25 transition-all">
            Servicios
          </a>
          <a href="/#sobre-mi"
             class="px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full text-slate-300 hover:text-violet-200 hover:bg-violet-600/25 transition-all">
            Sobre Mí
          </a>
          <a href="/#contacto"
             class="px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full text-slate-300 hover:text-white hover:bg-violet-600/25 transition-all">
            Contacto
          </a>
        </nav>

        <!-- Right Side: Admin Status & Cart -->
        <div class="flex items-center gap-2.5">
          
          <!-- ADMIN CONTROLS: VISIBLE ONLY IF LOGGED IN -->
          @if (auth.isAdmin()) {
            <div class="flex items-center gap-1.5 bg-[#170c33]/90 border border-emerald-500/30 p-1 rounded-2xl shadow-lg shadow-black/40">
              <button 
                type="button"
                (click)="onAdminClick($event)"
                title="Abrir Panel de Administración (CRUD Fotos, Servicios y Perfil)"
                class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-wide rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:from-emerald-400 hover:to-teal-500 transition-all shadow-md shadow-emerald-500/20">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <rect width="18" height="18" x="3" y="3" rx="2"/>
                  <path d="M7 7h10M7 12h10M7 17h10"/>
                </svg>
                <span>Panel CRUD</span>
              </button>

              <button
                type="button"
                (click)="onLogoutClick($event)"
                title="Cerrar sesión de Administradora"
                class="px-2 py-1.5 text-[11px] font-semibold text-rose-300 hover:bg-rose-950/60 hover:text-rose-200 rounded-xl transition-colors">
                Salir
              </button>
            </div>
          } @else {
            <!-- Discrete Login Access -->
            <a
              routerLink="/login"
              title="Acceso Administradora"
              class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-violet-200 transition-colors">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              <span>Acceso</span>
            </a>
          }

          <!-- Shopping Cart Trigger Button -->
          <button
            type="button"
            (click)="shop.openCart()"
            aria-label="Ver carrito de compras"
            class="relative p-2.5 rounded-xl bg-[#140b2e]/90 border border-violet-500/30 text-slate-200 hover:text-white hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/15 transition-all group">
            
            <svg class="w-5 h-5 transform group-hover:scale-110 transition-transform text-emerald-300 group-hover:text-emerald-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>

            <!-- Reactive Badge Counter -->
            @if (shop.cartCount() > 0) {
              <span class="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-emerald-400 text-slate-950 text-[11px] font-extrabold flex items-center justify-center shadow-lg shadow-emerald-400/50 animate-bounce">
                {{ shop.cartCount() }}
              </span>
            }
          </button>

          <!-- Mobile Hamburger Toggle -->
          <button
            type="button"
            (click)="toggleMobileMenu()"
            aria-label="Abrir menú"
            class="lg:hidden p-2 rounded-xl text-slate-200 hover:text-white hover:bg-violet-900/40 border border-violet-500/30 transition-all">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              @if (!isMobileMenuOpen()) {
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              } @else {
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              }
            </svg>
          </button>
        </div>

      </div>

      <!-- Mobile Dropdown Menu -->
      @if (isMobileMenuOpen()) {
        <div class="lg:hidden bg-[#0e0722]/95 border-b border-violet-500/30 backdrop-blur-2xl px-6 py-4 space-y-2 shadow-2xl animate-fadeIn">
          <a href="/#inicio"
             (click)="closeMobileMenu()"
             class="block py-2 text-sm font-semibold tracking-wider uppercase text-slate-200 hover:text-emerald-300 border-b border-violet-900/40">
            Inicio
          </a>
          <a href="/#albumes"
             (click)="closeMobileMenu()"
             class="block py-2 text-sm font-semibold tracking-wider uppercase text-slate-200 hover:text-emerald-300 border-b border-violet-900/40">
            Álbumes
          </a>
          <a href="/#galeria"
             (click)="closeMobileMenu()"
             class="block py-2 text-sm font-semibold tracking-wider uppercase text-slate-200 hover:text-sky-300 border-b border-violet-900/40">
            Portafolio
          </a>
          <a href="/#servicios"
             (click)="closeMobileMenu()"
             class="block py-2 text-sm font-semibold tracking-wider uppercase text-slate-200 hover:text-violet-300 border-b border-violet-900/40">
            Servicios
          </a>
          <a href="/#sobre-mi"
             (click)="closeMobileMenu()"
             class="block py-2 text-sm font-semibold tracking-wider uppercase text-slate-200 hover:text-violet-300 border-b border-violet-900/40">
            Sobre Mí
          </a>
          <a href="/#contacto"
             (click)="closeMobileMenu()"
             class="block py-2 text-sm font-semibold tracking-wider uppercase text-slate-200 hover:text-white border-b border-violet-900/40">
            Contacto
          </a>

          @if (!auth.isAdmin()) {
            <a routerLink="/login"
               (click)="closeMobileMenu()"
               class="block py-2 text-sm font-medium text-emerald-300">
              Acceso Administradora
            </a>
          }
        </div>
      }
    </header>
  `
})
export class NavbarComponent {
  readonly shop = inject(ShopService);
  readonly auth = inject(AuthService);
  isMobileMenuOpen = signal<boolean>(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  onAdminClick(event: Event): void {
    event.stopPropagation();
    this.shop.toggleAdminDashboard('photos');
  }

  onLogoutClick(event: Event): void {
    event.stopPropagation();
    this.auth.logout();
    this.shop.closeAdminDashboard();
  }
}
