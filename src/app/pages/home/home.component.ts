import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { ServicesComponent } from '../../components/services/services.component';
import { GalleryComponent } from '../../components/gallery/gallery.component';
import { AdminDashboardComponent } from '../../components/admin-dashboard/admin-dashboard.component';
import { CartDrawerComponent } from '../../components/cart-drawer/cart-drawer.component';
import { PhotoModalComponent } from '../../components/photo-modal/photo-modal.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ShopService } from '../../services/shop.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    ServicesComponent,
    GalleryComponent,
    AdminDashboardComponent,
    CartDrawerComponent,
    PhotoModalComponent,
    FooterComponent
  ],
  template: `
    <div class="min-h-screen bg-aura-mesh text-slate-800 flex flex-col relative selection:bg-teal-500 selection:text-white">
      
      <!-- Ambient Aura Floating Orbs (Ethereal mint, soft warm & sky) -->
      <div class="fixed top-24 left-1/4 w-[600px] h-[600px] rounded-full aura-orb-teal blur-[140px] pointer-events-none z-0"></div>
      <div class="fixed top-1/2 right-12 w-[500px] h-[500px] rounded-full aura-orb-warm blur-[130px] pointer-events-none z-0"></div>
      <div class="fixed bottom-24 left-1/3 w-[550px] h-[550px] rounded-full aura-orb-sky blur-[130px] pointer-events-none z-0"></div>

      <!-- Main Content Structure -->
      <div class="relative z-10 flex flex-col flex-grow">
        
        <!-- Fixed Header Navbar -->
        <app-navbar></app-navbar>

        <!-- Global Feedback Alert Banner (Errores CORS, 403 o Éxitos) -->
        @if (shop.globalAlert(); as alert) {
          <div 
            class="fixed top-24 right-4 sm:right-6 z-50 max-w-md w-[calc(100%-2rem)] shadow-2xl rounded-2xl p-4 border animate-slideLeft flex items-start gap-3 backdrop-blur-xl transition-all"
            [ngClass]="alert.type === 'error' 
              ? 'bg-red-50/95 border-red-200 text-red-900 shadow-red-500/10' 
              : 'bg-emerald-50/95 border-emerald-200 text-emerald-900 shadow-emerald-500/10'">
            
            <div class="p-2 rounded-xl flex-shrink-0"
                 [ngClass]="alert.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'">
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
              <h5 class="text-xs font-bold uppercase tracking-wider mb-0.5">
                {{ alert.type === 'error' ? 'Notificación de Error' : 'Operación Exitosa' }}
              </h5>
              <p class="text-xs leading-relaxed font-medium break-words">
                {{ alert.message }}
              </p>
            </div>

            <button 
              (click)="shop.clearAlert()" 
              aria-label="Cerrar notificación"
              class="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        }

        <!-- Hero / Sobre Mí Presentation Section -->
        <app-hero></app-hero>

        <!-- Fotos: Sales & Portfolio Gallery with Filters & Mandatory Ficha Técnica -->
        <app-gallery></app-gallery>

        <!-- Servicios Section (Casamientos, Cumpleaños de XV, Eventos en General) -->
        <app-services></app-services>

        <!-- Admin Quick Access Floating Banner (RENDERED ONLY IF LOGGED IN AS ADMIN) -->
        @if (auth.isAdmin()) {
          <section class="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full animate-fadeIn">
            <div class="card-fresh rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-teal-50/90 via-sky-50/80 to-white border-2 border-teal-300 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect width="18" height="18" x="3" y="3" rx="2"/>
                    <path d="M7 7h10M7 12h10M7 17h10"/>
                  </svg>
                </div>
                <div>
                  <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold uppercase tracking-wider mb-1">
                    <span class="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
                    <span>Modo Administradora Activo</span>
                  </div>
                  <h4 class="font-display font-bold text-slate-900 text-lg sm:text-xl">
                    Panel de Control y Edición (CRUD)
                  </h4>
                  <p class="text-xs sm:text-sm text-slate-600 mt-0.5">
                    Tienes permisos habilitados para crear, editar y eliminar fotos, servicios y actualizar tu perfil.
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <button
                  (click)="shop.openAdminDashboard('profile')"
                  class="px-4 py-2.5 rounded-xl border border-teal-300 text-teal-800 hover:bg-teal-100/70 font-semibold text-xs transition-colors">
                  Editar Mi Perfil
                </button>

                <button
                  (click)="shop.openAdminDashboard('photos')"
                  class="btn-fresh-gradient px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm whitespace-nowrap">
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

        <!-- Footer & Contact Details -->
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
}
