import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../services/shop.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="sobre-mi" class="py-20 md:py-28 relative overflow-hidden">
      
      <!-- Ambient Glows -->
      <div class="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-emerald-500/10 blur-[140px] pointer-events-none"></div>
      <div class="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-violet-600/15 blur-[140px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Asymmetrical Editorial Container: Portrait + Narrative -->
        <div class="card-editorial rounded-3xl p-6 sm:p-10 lg:p-14 border border-violet-500/15 bg-[#130b24] shadow-xl relative">
          
          <!-- Admin Quick Edit Profile Badge (VISIBLE ONLY IF LOGGED IN) -->
          @if (auth.isAdmin()) {
            <button
              type="button"
              (click)="shop.openAdminDashboard('profile')"
              title="Editar fotografía de perfil, bio y etiquetas"
              class="absolute top-5 right-5 z-20 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-xs font-bold hover:bg-emerald-900 transition-all flex items-center gap-1.5 shadow-md">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span>Editar Perfil & Tags</span>
            </button>
          }

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <!-- Asymmetrical Portrait Frame with Aura Halo -->
            <div class="lg:col-span-5 flex justify-center">
              <div class="relative group/img">
                <div class="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl p-[2.5px] bg-gradient-to-tr from-emerald-400/30 via-sky-400/20 to-violet-500/30 shadow-2xl shadow-violet-950/60">
                  <div class="w-full h-full rounded-[22px] overflow-hidden bg-[#0d071e] relative">
                    <img
                      [src]="shop.profile().imageUrl"
                      [alt]="shop.profile().name + ' - ' + shop.profile().title"
                      loading="lazy"
                      decoding="async"
                      class="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-700 ease-out"/>
                  </div>
                </div>

                <!-- Location Badge -->
                <div class="absolute -bottom-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1.5 rounded-full bg-[#120728]/95 text-emerald-300 border border-emerald-500/40 text-xs font-semibold shadow-lg flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span class="font-sans">{{ shop.profile().location }}</span>
                </div>
              </div>
            </div>

            <!-- Biographical Editorial Text & Dynamic Specialty Tags -->
            <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div class="space-y-2">
                <div class="inline-flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-[0.25em]">
                  <span class="w-4 h-[1px] bg-emerald-400"></span>
                  <span>Sobre la Fotógrafa</span>
                </div>

                <h2 class="font-editorial text-3xl sm:text-5xl font-light text-white leading-tight tracking-tight">
                  {{ shop.profile().name }}
                  <span class="block text-lg sm:text-xl font-sans font-normal text-violet-300/80 mt-1">
                    {{ shop.profile().title }}
                  </span>
                </h2>
              </div>

              <p class="text-slate-200 text-sm sm:text-base font-normal leading-relaxed font-sans">
                {{ shop.profile().bio }}
              </p>

              <!-- Dynamic Specialty Tags (Configured dynamically in Admin Profile) -->
              <div class="space-y-2.5 pt-2">
                <span class="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 block">
                  Especialidades & Servicios Clave:
                </span>
                
                <div class="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  @for (tag of (shop.profile().tags || defaultTags); track tag; let idx = $index) {
                    <span 
                      class="px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                      [ngClass]="idx % 3 === 0 
                        ? 'pill-mint hover:border-emerald-400' 
                        : (idx % 3 === 1 ? 'pill-sky hover:border-sky-400' : 'pill-lavender hover:border-violet-400')">
                      <span>{{ tag }}</span>
                    </span>
                  }
                </div>
              </div>

              <!-- Quick Connect Badges -->
              <div class="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <a
                  [href]="shop.defaultWhatsAppUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-editorial-mint px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                  <span>Contactar por WhatsApp</span>
                </a>

                <a
                  [href]="shop.defaultInstagramUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-4 py-2.5 rounded-xl bg-violet-950/60 border border-violet-500/30 text-violet-200 hover:text-white text-xs font-semibold transition-colors flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-fuchsia-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  `
})
export class AboutComponent {
  readonly shop = inject(ShopService);
  readonly auth = inject(AuthService);

  readonly defaultTags = [
    'Casamientos',
    'Cumpleaños de XV',
    'Eventos Sociales & Corporativos',
    'Retoque & Postproducción'
  ];
}
