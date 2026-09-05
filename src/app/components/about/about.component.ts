import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../services/shop.service';
import { AuthService } from '../../services/auth.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  template: `
    <section id="sobre-mi" class="py-20 md:py-32 relative overflow-hidden bg-[#142417]">
      
      <!-- Ambient Glows -->
      <div class="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-[#63B995]/20 blur-[150px] pointer-events-none"></div>
      <div class="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#86DEB7]/15 blur-[150px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <!-- Open Editorial Narrative Spread (Zero Card Enclosure) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          <!-- Asymmetrical Portrait Frame -->
          <div 
            appScrollReveal
            [revealDelay]="50"
            class="lg:col-span-5 flex justify-center">
            <div class="relative group/img w-full max-w-sm sm:max-w-md">
              <div class="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#63B995] shadow-2xl relative border border-[#86DEB7]">
                <img
                  [src]="shop.profile().imageUrl"
                  [alt]="shop.profile().name + ' - ' + shop.profile().title"
                  loading="lazy"
                  decoding="async"
                  class="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-700 ease-out"/>
                <div class="absolute inset-0 bg-gradient-to-t from-[#142417]/60 via-transparent to-transparent opacity-40"></div>
              </div>

              <!-- Location Badge -->
              <div class="absolute -bottom-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1.5 rounded-full bg-[#142417] backdrop-blur-md text-[#86DEB7] border border-[#86DEB7] text-xs font-mono tracking-wider shadow-lg flex items-center gap-2 font-bold">
                <span class="w-1.5 h-1.5 rounded-full bg-[#86DEB7] animate-pulse"></span>
                <span>{{ shop.profile().location }}</span>
              </div>
            </div>
          </div>

          <!-- Biographical Editorial Text & Dynamic Specialty Tags -->
          <div 
            appScrollReveal
            [revealDelay]="150"
            class="lg:col-span-7 space-y-7 text-center lg:text-left relative">
            
            <!-- Admin Quick Edit Profile Badge (VISIBLE ONLY IF LOGGED IN) -->
            @if (auth.isAdmin()) {
              <div class="flex justify-center lg:justify-start">
                <button
                  type="button"
                  (click)="shop.openAdminDashboard('profile')"
                  title="Editar fotografía de perfil, bio y etiquetas"
                  class="px-3.5 py-1.5 rounded-full bg-[#63B995] border border-[#86DEB7] text-[#142417] text-xs font-bold hover:bg-[#86DEB7] transition-all flex items-center gap-1.5 shadow-md">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  <span>Editar Perfil & Tags</span>
                </button>
              </div>
            }

            <div class="space-y-3">
              <div class="inline-flex items-center gap-2 text-[#86DEB7] text-xs font-bold uppercase tracking-[0.25em]">
                <span class="w-5 h-[1.5px] bg-[#86DEB7]"></span>
                <span>Sobre la Fotógrafa</span>
              </div>

              <h2 class="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold text-[#86DEB7] leading-tight tracking-tight">
                {{ shop.profile().name }}
                <span class="block text-base sm:text-lg font-sans font-bold text-[#63B995] mt-1.5 tracking-normal">
                  {{ shop.profile().title }}
                </span>
              </h2>
            </div>

            <p class="text-[#86DEB7]/90 text-base sm:text-lg font-medium leading-relaxed font-sans max-w-2xl mx-auto lg:mx-0">
              {{ shop.profile().bio }}
            </p>

            <!-- Dynamic Specialty Tags (Configured dynamically in Admin Profile) -->
            <div class="space-y-3 pt-2">
              <span class="text-[11px] font-mono uppercase tracking-[0.2em] text-[#63B995] block font-bold">
                Especialidades & Servicios Clave:
              </span>
              
              <div class="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                @for (tag of (shop.profile().tags || defaultTags); track tag) {
                  <span 
                    class="px-3.5 py-1.5 rounded-full text-xs font-bold border border-[#86DEB7] tracking-wide transition-all bg-[#142417] text-[#86DEB7] shadow-sm">
                    {{ tag }}
                  </span>
                }
              </div>
            </div>

            <!-- Quick Connect Badges -->
            <div class="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                [href]="shop.defaultWhatsAppUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-editorial-mint px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase flex items-center gap-2 shadow-md">
                <span>Contactar por WhatsApp</span>
              </a>

              <a
                [href]="shop.defaultInstagramUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="px-5 py-3 rounded-xl bg-[#63B995] border border-[#86DEB7] text-[#142417] hover:bg-[#86DEB7] hover:text-[#142417] text-xs font-bold tracking-wide transition-colors flex items-center gap-2 shadow-md">
                <svg class="w-4 h-4 text-[#142417] fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </a>
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
