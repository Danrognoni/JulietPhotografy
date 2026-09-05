import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, throwError } from 'rxjs';
import { ShopService } from '../../services/shop.service';
import { AuthService } from '../../services/auth.service';
import { ServiceItem } from '../../models/photo.model';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="servicios" class="py-20 md:py-28 relative overflow-hidden">
      
      <!-- Subtle Ambient Soft Aura Glows -->
      <div class="absolute top-1/4 right-5 w-80 h-80 rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none"></div>
      <div class="absolute bottom-10 left-5 w-80 h-80 rounded-full bg-sky-500/10 blur-[130px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-[0.25em]">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Propuestas de Cobertura</span>
          </div>
          
          <h2 class="font-editorial text-4xl sm:text-5xl lg:text-6xl text-white font-light tracking-tight">
            Servicios Fotográficos Profesionales
          </h2>

          <p class="text-slate-300 text-sm sm:text-base font-normal font-sans max-w-2xl mx-auto leading-relaxed">
            Coberturas sensibles y personalizadas para registrar la magia de cada celebración. Acompañamiento cercano desde la planificación hasta la entrega final en Mar del Plata y alrededores.
          </p>
        </div>

        <!-- Revel Editorial Services Grid (Numbered Columns) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          @for (service of shop.services(); track service.id; let idx = $index) {
            <article class="card-editorial rounded-3xl overflow-hidden flex flex-col justify-between group border border-violet-500/15 bg-[#130b24] shadow-lg hover:shadow-xl transition-all duration-300 relative">
              
              <!-- ADMIN ACTION BADGES (RENDERED ONLY IF LOGGED IN) -->
              @if (auth.isAdmin()) {
                <div class="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-[#120728]/95 p-1 rounded-xl shadow-lg border border-emerald-500/40">
                  <button
                    type="button"
                    (click)="editServiceAdmin(service)"
                    title="Editar servicio"
                    class="p-1.5 rounded-lg text-emerald-300 hover:bg-emerald-950/60 hover:text-white transition-colors">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>

                  <button
                    type="button"
                    (click)="deleteServiceAdmin(service.id)"
                    title="Eliminar servicio"
                    class="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/60 transition-colors">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              }

              <!-- Image Banner with Editorial Number Overlay -->
              <div class="relative h-60 overflow-hidden bg-[#0d071e]">
                <img
                  [src]="service.imageUrl"
                  [alt]="service.title"
                  loading="lazy"
                  decoding="async"
                  class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"/>
                <div class="absolute inset-0 bg-gradient-to-t from-[#0e0722] via-[#0e0722]/30 to-transparent"></div>
                
                <!-- Editorial Service Number (01, 02, 03) -->
                <span class="absolute top-4 left-5 font-editorial text-4xl font-light text-white/40 group-hover:text-emerald-300/80 transition-colors">
                  0{{ idx + 1 }}
                </span>

                <h3 class="absolute bottom-4 left-5 right-5 text-2xl sm:text-3xl font-editorial font-normal text-white tracking-tight drop-shadow-md">
                  {{ service.title }}
                </h3>
              </div>

              <!-- Content & Feature List -->
              <div class="p-6 sm:p-7 flex flex-col flex-grow justify-between space-y-6">
                
                <div class="space-y-4">
                  <p class="text-slate-300 text-sm leading-relaxed font-normal font-sans">
                    {{ service.description }}
                  </p>

                  <!-- Features List -->
                  @if (service.features && service.features.length > 0) {
                    <ul class="space-y-2 pt-3 border-t border-violet-500/20">
                      @for (feat of service.features; track feat) {
                        <li class="flex items-start gap-2 text-xs text-slate-300">
                          <svg class="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          <span>{{ feat }}</span>
                        </li>
                      }
                    </ul>
                  }
                </div>

                <!-- Primary CTA: Agendar Cobertura (WhatsApp) -->
                <div class="pt-4 border-t border-violet-500/20">
                  <a
                    [href]="service.whatsappUrl || shop.defaultWhatsAppUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-editorial-mint w-full py-3 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 group/btn shadow-md">
                    <span>Consultar Disponibilidad</span>
                    <svg class="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </a>
                </div>

              </div>

            </article>
          }
        </div>

      </div>
    </section>
  `
})
export class ServicesComponent {
  readonly shop = inject(ShopService);
  readonly auth = inject(AuthService);

  editServiceAdmin(service: ServiceItem): void {
    this.shop.startEditingService(service);
  }

  deleteServiceAdmin(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este servicio de cobertura?')) {
      this.shop.deleteService(id)
        .pipe(
          catchError((err) => {
            const cleanMsg = this.shop.getCleanErrorMessage(err, 'eliminar el servicio');
            console.error('[ServicesComponent] Error al eliminar servicio:', cleanMsg, err);
            this.shop.showAlert('error', cleanMsg);
            if (typeof window !== 'undefined') {
              alert(cleanMsg);
            }
            return throwError(() => err);
          })
        )
        .subscribe({
          next: () => {
            this.shop.showAlert('success', 'Servicio eliminado correctamente.');
          }
        });
    }
  }
}
