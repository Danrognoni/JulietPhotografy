import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { GalleryComponent } from '../../components/gallery/gallery.component';
import { ServicesComponent } from '../../components/services/services.component';
import { AboutComponent } from '../../components/about/about.component';
import { AdminDashboardComponent } from '../../components/admin-dashboard/admin-dashboard.component';
import { CartDrawerComponent } from '../../components/cart-drawer/cart-drawer.component';
import { PhotoModalComponent } from '../../components/photo-modal/photo-modal.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { ShopService } from '../../services/shop.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    HeroComponent,
    GalleryComponent,
    ServicesComponent,
    AboutComponent,
    AdminDashboardComponent,
    CartDrawerComponent,
    PhotoModalComponent,
    FooterComponent,
    ScrollRevealDirective
  ],
  template: `
    <div class="min-h-screen bg-aura-mesh text-[#86DEB7] flex flex-col relative selection:bg-[#86DEB7] selection:text-[#142417]">
      
      <!-- Main Content Structure -->
      <div class="relative z-10 flex flex-col flex-grow">
        
        <!-- Fixed Header Navbar -->
        <app-navbar></app-navbar>

        <!-- Global Feedback Alert Banner -->
        @if (shop.globalAlert(); as alert) {
          <div 
            class="fixed top-24 right-4 sm:right-6 z-50 max-w-md w-[calc(100%-2rem)] shadow-2xl rounded-2xl p-4 border animate-slideLeft flex items-start gap-3 backdrop-blur-xl transition-all"
            [ngClass]="alert.type === 'error' 
              ? 'bg-[#142417] border-[#86DEB7] text-[#86DEB7]' 
              : 'bg-[#63B995] border-[#86DEB7] text-[#142417]'">
            
            <div class="p-2 rounded-xl flex-shrink-0"
                 [ngClass]="alert.type === 'error' ? 'bg-[#63B995] text-[#142417]' : 'bg-[#142417] text-[#86DEB7]'">
              @if (alert.type === 'error') {
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              } @else {
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              }
            </div>

            <div class="flex-grow min-w-0 pr-2">
              <h5 class="text-xs font-bold uppercase tracking-wider mb-0.5"
                  [ngClass]="alert.type === 'error' ? 'text-[#86DEB7]' : 'text-[#142417]'">
                {{ alert.type === 'error' ? 'Notificación de Error' : 'Operación Exitosa' }}
              </h5>
              <p class="text-xs leading-relaxed font-medium break-words"
                 [ngClass]="alert.type === 'error' ? 'text-[#86DEB7]' : 'text-[#142417]'">
                {{ alert.message }}
              </p>
            </div>

            <button 
              (click)="shop.clearAlert()" 
              aria-label="Cerrar notificación"
              class="p-1 rounded-lg transition-colors hover:opacity-80"
              [ngClass]="alert.type === 'error' ? 'text-[#86DEB7]' : 'text-[#142417]'">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        }

        <!-- 1. Hero Section (Pixpa Aspect Full Cover) -->
        <app-hero></app-hero>

        <!-- 2. Sección de Carpetas / Álbumes de Fotos & Portafolio -->
        <app-gallery></app-gallery>

        <!-- 3. Sección de Servicios (Columnas Editoriales Aspect 01, 02, 03) -->
        <app-services></app-services>

        <!-- 4. Sección Sobre Mí (Bio Asimétrica, Retrato & Dynamic Tags) -->
        <app-about></app-about>

        <!-- Admin Quick Access Floating Banner (RENDERED ONLY IF LOGGED IN AS ADMIN) -->
        @if (auth.isAdmin()) {
          <section 
            appScrollReveal
            class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div class="rounded-2xl p-6 sm:p-8 bg-[#63B995] border border-[#86DEB7] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl text-[#142417]">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-[#142417] text-[#86DEB7] border border-[#86DEB7] flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <rect width="18" height="18" x="3" y="3" rx="2"/>
                    <path d="M7 7h10M7 12h10M7 17h10"/>
                  </svg>
                </div>
                <div>
                  <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#142417] border border-[#86DEB7] text-[#86DEB7] text-[11px] font-bold uppercase tracking-wider mb-1">
                    <span class="w-2 h-2 rounded-full bg-[#86DEB7] animate-pulse"></span>
                    <span>Modo Administradora Activo</span>
                  </div>
                  <h4 class="font-editorial text-2xl font-bold text-[#142417]">
                    Panel de Control & Edición (CRUD)
                  </h4>
                  <p class="text-xs sm:text-sm text-[#142417]/90 mt-0.5 font-sans font-medium">
                    Tienes permisos habilitados para crear o editar fotos, fijar foto de portada hero, álbumes, servicios y tu perfil.
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <button
                  (click)="shop.openAdminDashboard('profile')"
                  class="btn-aura-outline px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors">
                  Editar Mi Perfil
                </button>

                <button
                  (click)="shop.openAdminDashboard('photos')"
                  class="btn-editorial-mint px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm whitespace-nowrap">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  <span>Abrir Panel CRUD</span>
                </button>
              </div>
            </div>
          </section>
        }

        <!-- 5. Footer & Contact Details -->
        <app-footer></app-footer>

      </div>

      <!-- Modals & Drawers -->
      @if (auth.isAdmin()) {
        <app-admin-dashboard></app-admin-dashboard>
      }
      <app-cart-drawer></app-cart-drawer>
      <app-photo-modal></app-photo-modal>

    </div>
  `
})
export class HomeComponent {
  readonly shop = inject(ShopService);
  readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    this.route.data.subscribe(data => {
      if (data && data['tab']) {
        this.shop.openAdminDashboard(data['tab']);
      }
    });
  }
}
