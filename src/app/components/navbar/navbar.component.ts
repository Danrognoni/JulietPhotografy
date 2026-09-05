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
            <span class="block text-[9px] tracking-[0.25em] text-violet-300/70 uppercase -mt-0.5 font-sans font-medium">
              Técnica en Fotografía · Mar del Plata
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

        <!-- Right Side: Instagram, Admin Status, & Cart -->
        <div class="flex items-center gap-2.5">
          
          <!-- Instagram Direct Link -->
          <a
            [href]="shop.defaultInstagramUrl"
            target="_blank"
            rel="noopener noreferrer"
            title="Seguir a @julietamph_ en Instagram"
            class="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-950/60 text-violet-300 border border-violet-500/25 hover:border-fuchsia-400/40 hover:text-white text-xs font-medium transition-all">
            <svg class="w-3.5 h-3.5 text-fuchsia-400 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>&#64;julietamph_</span>
          </a>

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
