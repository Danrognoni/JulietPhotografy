import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../services/shop.service';
import { PhotoCategory } from '../../models/photo.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="fixed top-0 left-0 w-full z-40 glass-violet-nav border-b border-purple-900/30 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <!-- Brand Logo -->
        <a href="#inicio" class="flex items-center gap-3 group focus:outline-none">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-purple-800 p-[1.5px] shadow-lg shadow-purple-900/40 group-hover:shadow-purple-600/50 transition-all duration-300">
            <div class="w-full h-full bg-[#0d051c] rounded-[10px] flex items-center justify-center">
              <!-- Aperture / Camera Lens Icon -->
              <svg class="w-5 h-5 text-purple-300 group-hover:text-fuchsia-300 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            <span class="font-display font-bold text-lg sm:text-xl tracking-wider text-white flex items-center gap-1.5">
              JULIET <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 font-light">STUDIO</span>
            </span>
            <span class="block text-[10px] tracking-[0.25em] text-purple-300/60 uppercase -mt-0.5">Galería & Tienda Fine Art</span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-1 bg-[#130826]/70 px-4 py-1.5 rounded-full border border-purple-800/30 backdrop-blur-md">
          <a href="#inicio"
             (click)="selectCategory('Todos')"
             class="px-4 py-1.5 text-sm font-medium rounded-full text-purple-200 hover:text-white hover:bg-purple-900/40 transition-all">
            Inicio
          </a>
          <a href="#galeria"
             (click)="selectCategory('Paisaje')"
             class="px-4 py-1.5 text-sm font-medium rounded-full transition-all"
             [ngClass]="shop.selectedCategory() === 'Paisaje' ? 'bg-purple-700/50 text-white shadow-sm' : 'text-purple-300 hover:text-white hover:bg-purple-900/30'">
            Paisajes
          </a>
          <a href="#galeria"
             (click)="selectCategory('Producto')"
             class="px-4 py-1.5 text-sm font-medium rounded-full transition-all"
             [ngClass]="shop.selectedCategory() === 'Producto' ? 'bg-purple-700/50 text-white shadow-sm' : 'text-purple-300 hover:text-white hover:bg-purple-900/30'">
            Productos
          </a>
          <button (click)="shop.openUploadModal()"
             class="px-4 py-1.5 text-sm font-medium rounded-full text-purple-300 hover:text-fuchsia-300 hover:bg-purple-900/30 transition-all flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Subir Obra
          </button>
          <a href="#contacto"
             class="px-4 py-1.5 text-sm font-medium rounded-full text-purple-200 hover:text-white hover:bg-purple-900/40 transition-all">
            Contacto
          </a>
        </nav>

        <!-- Right Side: Cart Button & Admin Upload CTA -->
        <div class="flex items-center gap-3">
          <!-- Quick Upload Button (Desktop) -->
          <button 
            (click)="shop.openUploadModal()"
            title="Subir nueva fotografía al catálogo"
            class="hidden lg:flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl bg-purple-950/60 border border-purple-700/40 text-purple-300 hover:text-white hover:border-purple-500 hover:bg-purple-900/40 transition-all shadow-sm">
            <svg class="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
              <path d="M12 12v9"/>
              <path d="m16 16-4-4-4 4"/>
            </svg>
            <span>Subir Obra</span>
          </button>

          <!-- Shopping Cart Trigger Button -->
          <button
            (click)="shop.openCart()"
            aria-label="Ver carrito de compras"
            class="relative p-2.5 rounded-xl bg-gradient-to-br from-purple-900/50 to-fuchsia-950/50 border border-purple-500/30 text-purple-200 hover:text-white hover:border-fuchsia-400/70 hover:shadow-lg hover:shadow-purple-900/50 transition-all group">
            
            <svg class="w-6 h-6 transform group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>

            <!-- Reactive Badge Counter -->
            @if (shop.cartCount() > 0) {
              <span class="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white text-[11px] font-bold flex items-center justify-center shadow-md shadow-fuchsia-900/60 animate-bounce">
                {{ shop.cartCount() }}
              </span>
            }
          </button>

          <!-- Mobile Hamburger Toggle -->
          <button
            (click)="toggleMobileMenu()"
            aria-label="Abrir menú"
            class="md:hidden p-2 rounded-xl text-purple-300 hover:text-white hover:bg-purple-900/30 border border-purple-800/40 transition-all">
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
        <div class="md:hidden bg-[#0e051c]/95 border-b border-purple-900/50 backdrop-blur-2xl px-6 py-5 space-y-3 animate-fadeIn">
          <a href="#inicio"
             (click)="closeMobileMenu(); selectCategory('Todos')"
             class="block py-2 text-base font-medium text-purple-200 hover:text-white border-b border-purple-900/20">
            Inicio
          </a>
          <a href="#galeria"
             (click)="closeMobileMenu(); selectCategory('Paisaje')"
             class="block py-2 text-base font-medium text-purple-300 hover:text-white border-b border-purple-900/20">
            Paisajes
          </a>
          <a href="#galeria"
             (click)="closeMobileMenu(); selectCategory('Producto')"
             class="block py-2 text-base font-medium text-purple-300 hover:text-white border-b border-purple-900/20">
            Productos
          </a>
          <button
             (click)="closeMobileMenu(); shop.openUploadModal()"
             class="w-full text-left py-2 text-base font-medium text-fuchsia-300 hover:text-white border-b border-purple-900/20 flex items-center justify-between">
            <span>Subir Nueva Fotografía</span>
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <a href="#contacto"
             (click)="closeMobileMenu()"
             class="block py-2 text-base font-medium text-purple-200 hover:text-white">
            Contacto
          </a>
        </div>
      }
    </header>
  `
})
export class NavbarComponent {
  readonly shop = inject(ShopService);
  readonly isMobileMenuOpen = signal<boolean>(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  selectCategory(cat: PhotoCategory | 'Todos'): void {
    this.shop.setCategory(cat);
  }
}
