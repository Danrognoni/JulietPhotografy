import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShopService } from '../../services/shop.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer id="contacto" class="border-t border-[#86DEB7]/30 bg-[#142417] pt-20 pb-12 relative z-10 text-[#86DEB7]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Revel Editorial Consultation Banner -->
        <div class="mb-16 p-8 sm:p-12 lg:p-16 rounded-3xl bg-[#63B995] border border-[#86DEB7] shadow-2xl relative overflow-hidden text-[#142417]">
          
          <div class="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#86DEB7]/20 blur-[100px] pointer-events-none"></div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
            
            <div class="space-y-4">
              <span class="inline-block px-3.5 py-1 rounded-full bg-[#142417] border border-[#86DEB7] text-[#86DEB7] text-xs font-bold uppercase tracking-[0.25em]">
                Contacto & Presupuestos
              </span>

              <h3 class="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#142417] font-bold leading-tight tracking-tight">
                ¿Planeando tu fecha especial o proyecto fotográfico?
              </h3>

              <p class="text-[#142417]/95 text-sm sm:text-base leading-relaxed font-medium font-sans">
                Escribime directamente por WhatsApp o correo electrónico para verificar disponibilidad de agenda, resolver dudas y coordinar una entrevista personalizada en Mar del Plata.
              </p>
            </div>

            <!-- Contact Actions (WhatsApp, Instagram, Email) -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              
              <!-- WhatsApp Card -->
              <a
                [href]="shop.defaultWhatsAppUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="p-5 rounded-2xl bg-[#142417] border border-[#86DEB7] shadow-md hover:bg-[#86DEB7] transition-all group flex flex-col items-center text-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-[#63B995] text-[#142417] group-hover:bg-[#142417] group-hover:text-[#86DEB7] transition-colors flex items-center justify-center border border-[#86DEB7] shadow-inner">
                  <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/>
                  </svg>
                </div>
                <div>
                  <span class="text-[10px] text-[#86DEB7] group-hover:text-[#142417] font-bold uppercase tracking-wider block font-sans">WhatsApp</span>
                  <span class="text-xs font-bold text-[#86DEB7] group-hover:text-[#142417] font-mono block">2281311917</span>
                </div>
              </a>

              <!-- Instagram Card -->
              <a
                [href]="shop.defaultInstagramUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="p-5 rounded-2xl bg-[#142417] border border-[#86DEB7] shadow-md hover:bg-[#86DEB7] transition-all group flex flex-col items-center text-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-[#63B995] text-[#142417] group-hover:bg-[#142417] group-hover:text-[#86DEB7] transition-colors flex items-center justify-center border border-[#86DEB7] shadow-inner">
                  <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div>
                  <span class="text-[10px] text-[#86DEB7] group-hover:text-[#142417] font-bold uppercase tracking-wider block font-sans">Instagram</span>
                  <span class="text-xs font-bold text-[#86DEB7] group-hover:text-[#142417] block">&#64;julietamph_</span>
                </div>
              </a>

              <!-- Email Card -->
              <a
                href="mailto:julietamarateo4@gmail.com"
                class="p-5 rounded-2xl bg-[#142417] border border-[#86DEB7] shadow-md hover:bg-[#86DEB7] transition-all group flex flex-col items-center text-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-[#63B995] text-[#142417] group-hover:bg-[#142417] group-hover:text-[#86DEB7] transition-colors flex items-center justify-center border border-[#86DEB7] shadow-inner">
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <div class="min-w-0">
                  <span class="text-[10px] text-[#86DEB7] group-hover:text-[#142417] font-bold uppercase tracking-wider block font-sans">Correo</span>
                  <span class="text-[11px] font-bold text-[#86DEB7] group-hover:text-[#142417] truncate block">julietamarateo4&#64;...</span>
                </div>
              </a>

            </div>

          </div>
        </div>

        <!-- Main Footer Columns -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <!-- Column 1: Identity -->
          <div class="md:col-span-2 space-y-3">
            <span class="font-editorial text-2xl tracking-[0.15em] uppercase text-[#86DEB7] font-bold block">
              JULIETA MARATEO
            </span>
            <p class="text-xs text-[#86DEB7]/90 max-w-sm leading-relaxed font-sans font-medium">
              Técnica en Fotografía radicada en Mar del Plata. Coberturas integrales para bodas, quince años y eventos sociales con enfoque artístico y documental.
            </p>
          </div>

          <!-- Column 2: Navigation Links -->
          <div class="space-y-2">
            <h5 class="text-xs font-bold uppercase tracking-wider text-[#86DEB7] font-sans">Navegación</h5>
            <ul class="space-y-1.5 text-xs text-[#63B995] font-sans font-semibold">
              <li><a href="/#inicio" class="hover:text-[#86DEB7] transition-colors">Inicio</a></li>
              <li><a href="/#albumes" class="hover:text-[#86DEB7] transition-colors">Álbumes Temáticos</a></li>
              <li><a href="/#galeria" class="hover:text-[#86DEB7] transition-colors">Portafolio & Fotos</a></li>
              <li><a href="/#servicios" class="hover:text-[#86DEB7] transition-colors">Servicios</a></li>
              <li><a href="/#sobre-mi" class="hover:text-[#86DEB7] transition-colors">Sobre Mí</a></li>
            </ul>
          </div>

          <!-- Column 3: Administration Access -->
          <div class="space-y-2">
            <h5 class="text-xs font-bold uppercase tracking-wider text-[#86DEB7] font-sans">Administración</h5>
            <div class="space-y-2">
              @if (auth.isAdmin()) {
                <button
                  type="button"
                  (click)="shop.openAdminDashboard('photos')"
                  class="btn-editorial-mint px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md">
                  <span>Abrir Panel CRUD</span>
                </button>
                <p class="text-[11px] text-[#86DEB7]/90 font-medium">
                  Sesión activa: <strong class="text-[#86DEB7]">{{ auth.currentUser()?.email }}</strong>
                </p>
              } @else {
                <a routerLink="/login" class="text-xs text-[#63B995] hover:text-[#86DEB7] transition-colors block font-semibold">
                  Acceso Administradora
                </a>
              }
            </div>
          </div>

        </div>

        <!-- Copyright -->
        <div class="pt-8 border-t border-[#63B995]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#86DEB7]/80 font-medium">
          <p>© 2026 Julieta Marateo · Técnica en Fotografía. Mar del Plata, Argentina.</p>
          <p class="text-[11px] text-[#86DEB7]/70">Diseño Editorial Inspirado en Revel · Todos los derechos reservados.</p>
        </div>

      </div>
    </footer>
  `
})
export class FooterComponent {
  readonly shop = inject(ShopService);
  readonly auth = inject(AuthService);
}
