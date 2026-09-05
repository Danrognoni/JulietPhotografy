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
    <header class="fixed top-0 left-0 w-full z-40 bg-[#0a0712]/85 backdrop-blur-md border-b border-white/[0.06] transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between">
        
        <!-- Left / Centered Editorial Masthead (Pixpa Aspect style) -->
        <a href="/#inicio" class="flex flex-col items-start focus:outline-none group">
          <span class="font-editorial text-2xl sm:text-3xl tracking-[0.18em] uppercase font-light text-white group-hover:text-slate-200 transition-colors">
            JULIETA <span class="font-normal italic text-slate-300">MARATEO</span>
          </span>
          <span class="text-[9px] tracking-[0.35em] text-slate-400 uppercase font-sans -mt-0.5">
            Técnica en Fotografía
          </span>
        </a>

        <!-- Desktop Navigation: Elegant Unboxed Text Links (Pixpa Aspect) -->
        <nav class="hidden lg:flex items-center gap-7 text-xs font-sans tracking-[0.22em] uppercase font-medium">
          <a href="/#inicio"
             class="text-slate-300 hover:text-white transition-colors py-1 relative group">
            <span>Inicio</span>
            <span class="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="/#albumes"
             class="text-slate-300 hover:text-white transition-colors py-1 relative group">
            <span>Álbumes</span>
            <span class="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="/#galeria"
             class="text-slate-300 hover:text-white transition-colors py-1 relative group">
            <span>Portafolio</span>
            <span class="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="/#servicios"
             class="text-slate-300 hover:text-white transition-colors py-1 relative group">
            <span>Servicios</span>
            <span class="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="/#sobre-mi"
             class="text-slate-300 hover:text-white transition-colors py-1 relative group">
            <span>Sobre Mí</span>
            <span class="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="/#contacto"
             class="text-slate-300 hover:text-white transition-colors py-1 relative group">
            <span>Contacto</span>
            <span class="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </a>
        </nav>

        <!-- Right Side: Admin Status & Cart -->
        <div class="flex items-center gap-3">
          
          <!-- ADMIN CONTROLS: VISIBLE ONLY IF LOGGED IN -->
          @if (auth.isAdmin()) {
            <div class="flex items-center gap-1 bg-[#150c2e]/90 border border-emerald-500/30 p-1 rounded-xl shadow-md">
              <button 
                type="button"
                (click)="onAdminClick($event)"
                title="Abrir Panel de Administración (CRUD Fotos, Servicios y Perfil)"
                class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-wider rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="18" height="18" x="3" y="3" rx="2"/>
                  <path d="M7 7h10M7 12h10M7 17h10"/>
                </svg>
                <span>Panel CRUD</span>
              </button>

              <button
                type="button"
                (click)="onLogoutClick($event)"
                title="Cerrar sesión de Administradora"
                class="px-2 py-1.5 text-[11px] font-semibold text-rose-300 hover:bg-rose-950/60 rounded-lg transition-colors">
                Salir
              </button>
            </div>
          } @else {
            <!-- Discrete Login Access -->
            <a
              routerLink="/login"
              title="Acceso Administradora"
              class="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-sans tracking-widest text-slate-400 hover:text-white transition-colors uppercase text-[11px]">
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
            class="relative p-2.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-slate-200 hover:text-white hover:border-emerald-400/50 transition-all group">
            
            <svg class="w-4.5 h-4.5 text-slate-200 group-hover:text-emerald-300 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>

            <!-- Reactive Badge Counter -->
            @if (shop.cartCount() > 0) {
              <span class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-extrabold flex items-center justify-center shadow-md">
                {{ shop.cartCount() }}
              </span>
            }
          </button>

          <!-- Mobile Hamburger Toggle -->
          <button
            type="button"
            (click)="toggleMobileMenu()"
            aria-label="Abrir menú"
            class="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white border border-white/[0.1] transition-all">
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
