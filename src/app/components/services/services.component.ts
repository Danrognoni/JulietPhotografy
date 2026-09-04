import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../services/shop.service';
import { AuthService } from '../../services/auth.service';
import { ServiceItem } from '../../models/photo.model';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="servicios" class="py-20 md:py-28 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Section Title & Intro -->
        <div class="text-center max-w-3xl mx-auto mb-16">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider mb-3">
            <span class="w-2 h-2 rounded-full bg-teal-500"></span>
            <span>Servicios de Cobertura</span>
          </div>
          <h2 class="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight">
            Servicios Fotográficos Profesionales
          </h2>
          <p class="text-slate-600 text-sm sm:text-base mt-4 font-normal leading-relaxed">
            Coberturas personalizadas para plasmar la emoción de cada festejo. Equipamiento de primer nivel, empatía con los protagonistas y entrega impecable en Mar del Plata y zona.
          </p>
        </div>

        <!-- Services Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          @for (service of shop.services(); track service.id) {
            <div class="card-fresh rounded-3xl overflow-hidden flex flex-col justify-between group border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 relative">
              
              <!-- ADMIN ACTION BADGES (RENDERED ONLY IF LOGGED IN) -->
              @if (auth.isAdmin()) {
                <div class="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200">
                  <button
                    (click)="editServiceAdmin(service)"
                    title="Editar servicio"
                    class="p-1.5 rounded-lg text-teal-700 hover:bg-teal-50 transition-colors">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>

                  <button
                    (click)="deleteServiceAdmin(service.id)"
                    title="Eliminar servicio"
                    class="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              }

              <!-- Image Banner with subtle zoom -->
              <div class="relative h-56 overflow-hidden bg-slate-100">
                <img
                  [src]="service.imageUrl"
                  [alt]="service.title"
                  loading="lazy"
                  class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"/>
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>
                <h3 class="absolute bottom-4 left-5 text-xl sm:text-2xl font-display font-bold text-white tracking-tight drop-shadow-sm">
                  {{ service.title }}
                </h3>
              </div>

              <!-- Content & Details -->
              <div class="p-6 sm:p-7 flex flex-col flex-grow justify-between space-y-6">
                
                <div class="space-y-4">
                  <p class="text-slate-600 text-sm leading-relaxed font-normal">
                    {{ service.description }}
                  </p>

                  <!-- Features List -->
                  @if (service.features && service.features.length > 0) {
                    <ul class="space-y-2 pt-2 border-t border-slate-100">
                      @for (feat of service.features; track feat) {
                        <li class="flex items-start gap-2 text-xs text-slate-700">
                          <svg class="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          <span>{{ feat }}</span>
                        </li>
                      }
                    </ul>
                  }
                </div>

                <!-- Primary CTA: Agendar una cita (WhatsApp) -->
                <div class="pt-4 border-t border-slate-100 space-y-2.5">
                  <a
                    [href]="service.whatsappUrl || shop.defaultWhatsAppUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-full btn-whatsapp py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 group/btn">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/>
                    </svg>
                    <span>Agendar una cita</span>
                    <svg class="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </a>

                  <!-- Secondary Instagram peek -->
                  <a
                    [href]="shop.defaultInstagramUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-full text-center text-xs text-slate-500 hover:text-pink-600 transition-colors flex items-center justify-center gap-1.5 py-1">
                    <svg class="w-3.5 h-3.5 fill-current text-pink-600" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Ver más coberturas en &#64;julietamph_</span>
                  </a>
                </div>

              </div>

            </div>
          }
        </div>

        <!-- Instagram Community Banner -->
        <div class="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-50 via-teal-50 to-sky-50 border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div>
              <h4 class="font-display font-bold text-slate-800 text-base sm:text-lg">
                Sígueme en Instagram: <span class="text-pink-600">&#64;julietamph_</span>
              </h4>
              <p class="text-xs sm:text-sm text-slate-600 mt-0.5">
                Publicaciones semanales con adelantos de bodas, reels de fiestas de XV y backstage en Mar del Plata.
              </p>
            </div>
          </div>

          <a [href]="shop.defaultInstagramUrl"
             target="_blank"
             rel="noopener noreferrer"
             class="btn-instagram px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap shadow-sm">
            Ver Instagram &#64;julietamph_
          </a>
        </div>

      </div>
    </section>
  `
})
export class ServicesComponent {
  readonly shop = inject(ShopService);
  readonly auth = inject(AuthService);

  editServiceAdmin(service: ServiceItem): void {
    this.shop.openAdminDashboard('services');
  }

  deleteServiceAdmin(id: string): void {
    if (confirm('¿Eliminar este servicio permanentemente?')) {
      this.shop.deleteService(id);
    }
  }
}
