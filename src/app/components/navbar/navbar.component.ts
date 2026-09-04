import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../services/shop.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="fixed top-0 left-0 w-full z-40 glass-header-light border-b border-slate-200/80 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <!-- Brand Logo / Signature -->
        <a href="#inicio" class="flex items-center gap-3 group focus:outline-none">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 via-sky-400 to-teal-500 p-[1.5px] shadow-sm group-hover:shadow-md transition-all">
            <div class="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <svg class="w-5 h-5 text-teal-600 group-hover:text-sky-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="14.31" y1="8" x2="20.05" y2="17.94"/>
                <line x1="9.69" y1="8" x2="21.17" y2="8"/>
                <line x1="7.38" y1="12" x2="13.12" y2="21.94"/>
                <line x1="9.69" y1="16" x2="3.95" y2="6.06"/>
                <line x1="14.31" y1="16" x2="2.83" y2="16"/>
                <line x1="16.62" y1="12" x2="10.88" y2="2.06"/>
              </svg>
            </div>
          </div>
          <div>
            <span class="font-display font-bold text-lg sm:text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
              JULIETA <span class="text-teal-600 font-medium">MARATEO</span>
            </span>
            <span class="block text-[10px] tracking-wider text-slate-500 uppercase -mt-0.5 font-medium">
              Técnica en Fotografía · Mar del Plata
            </span>
          </div>
        </a>

        <!-- Desktop Navigation Menu: Inicio, Fotos, Servicios, Sobre mí, Contacto -->
        <nav class="hidden lg:flex items-center gap-1 bg-white/80 px-3 py-1.5 rounded-full border border-slate-200/80 shadow-xs backdrop-blur-md">
          <a href="#inicio"
             class="px-3.5 py-1.5 text-xs font-semibold rounded-full text-slate-700 hover:text-teal-700 hover:bg-teal-50/60 transition-all">
            Inicio
          </a>
          <a href="#fotos"
             class="px-3.5 py-1.5 text-xs font-semibold rounded-full text-slate-700 hover:text-teal-700 hover:bg-teal-50/60 transition-all">
            Fotos
          </a>
          <a href="#servicios"
             class="px-3.5 py-1.5 text-xs font-semibold rounded-full text-slate-700 hover:text-teal-700 hover:bg-teal-50/60 transition-all">
            Servicios
          </a>
          <a href="#sobre-mi"
             class="px-3.5 py-1.5 text-xs font-semibold rounded-full text-slate-700 hover:text-teal-700 hover:bg-teal-50/60 transition-all">
            Sobre mí
          </a>
          <a href="#contacto"
             class="px-3.5 py-1.5 text-xs font-semibold rounded-full text-slate-700 hover:text-teal-700 hover:bg-teal-50/60 transition-all">
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
            class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200 hover:bg-pink-100 text-xs font-semibold transition-all">
            <svg class="w-4 h-4 text-pink-600 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>&#64;julietamph_</span>
          </a>

          <!-- ADMIN BUTTONS: VISIBLE ONLY IF LOGGED IN -->
          @if (auth.isAdmin()) {
            <div class="flex items-center gap-1.5 bg-teal-50/90 border border-teal-200/90 p-1 rounded-2xl shadow-xs">
              <button 
                (click)="shop.toggleAdminDashboard('photos')"
                title="Abrir Panel de Administración (CRUD Fotos, Servicios y Perfil)"
                class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold tracking-wide rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition-all shadow-xs">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="18" height="18" x="3" y="3" rx="2"/>
                  <path d="M7 7h10M7 12h10M7 17h10"/>
                </svg>
                <span>Admin</span>
              </button>

              <button
                (click)="auth.logout()"
                title="Cerrar sesión de Administradora"
                class="px-2 py-1.5 text-[11px] font-semibold text-red-600 hover:bg-red-100/60 rounded-xl transition-colors">
                Salir
              </button>
            </div>
          }

          <!-- Shopping Cart Trigger Button -->
          <button
            (click)="shop.openCart()"
            aria-label="Ver carrito de compras"
            class="relative p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-teal-700 hover:border-teal-300 hover:shadow-xs transition-all group">
            
            <svg class="w-5 h-5 transform group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>

            <!-- Reactive Badge Counter -->
            @if (shop.cartCount() > 0) {
              <span class="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-gradient-to-r from-teal-500 to-sky-500 text-white text-[11px] font-bold flex items-center justify-center shadow-xs animate-bounce">
                {{ shop.cartCount() }}
              </span>
            }
          </button>

          <!-- Mobile Hamburger Toggle -->
          <button
            (click)="toggleMobileMenu()"
            aria-label="Abrir menú"
            class="lg:hidden p-2 rounded-xl text-slate-700 hover:text-teal-700 hover:bg-slate-100 border border-slate-200 transition-all">
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
        <div class="lg:hidden bg-white/95 border-b border-slate-200 backdrop-blur-xl px-6 py-4 space-y-2 shadow-lg animate-fadeIn">
          <a href="#inicio"
             (click)="closeMobileMenu()"
             class="block py-2 text-sm font-semibold text-slate-800 hover:text-teal-600 border-b border-slate-100">
            Inicio
          </a>
          <a href="#fotos"
             (click)="closeMobileMenu()"
             class="block py-2 text-sm font-semibold text-slate-800 hover:text-teal-600 border-b border-slate-100">
            Fotos
          </a>
          <a href="#servicios"
             (click)="closeMobileMenu()"
             class="block py-2 text-sm font-semibold text-slate-800 hover:text-teal-600 border-b border-slate-100">
            Servicios
          </a>
          <a href="#sobre-mi"
             (click)="closeMobileMenu()"
             class="block py-2 text-sm font-semibold text-slate-800 hover:text-teal-600 border-b border-slate-100">
            Sobre mí
          </a>
          <a href="#contacto"
             (click)="closeMobileMenu()"
             class="block py-2 text-sm font-semibold text-slate-800 hover:text-teal-600 border-b border-slate-100">
            Contacto
          </a>

          <a [href]="shop.defaultInstagramUrl"
             target="_blank"
             rel="noopener noreferrer"
             (click)="closeMobileMenu()"
             class="flex items-center gap-2 py-2 text-sm font-semibold text-pink-600 hover:text-pink-700 border-b border-slate-100">
            <span>Instagram: &#64;julietamph_</span>
          </a>

          @if (auth.isAdmin()) {
            <div class="pt-2 flex items-center justify-between">
              <button
                 (click)="closeMobileMenu(); shop.openAdminDashboard('photos')"
                 class="py-2 text-sm font-bold text-teal-700 hover:text-teal-900 flex items-center gap-2">
                <span>Panel Admin (CRUD)</span>
              </button>
              <button
                (click)="closeMobileMenu(); auth.logout()"
                class="text-xs font-semibold text-red-600">
                Cerrar Sesión
              </button>
            </div>
          }
        </div>
      }
    </header>
  `
})
export class NavbarComponent {
  readonly shop = inject(ShopService);
  readonly auth = inject(AuthService);
  readonly isMobileMenuOpen = signal<boolean>(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
