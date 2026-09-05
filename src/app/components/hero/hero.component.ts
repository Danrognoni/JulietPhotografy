import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShopService } from '../../services/shop.service';
import { AuthService } from '../../services/auth.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule, ScrollRevealDirective],
  template: `
    <section id="inicio" class="relative pt-20 sm:pt-24 w-full overflow-hidden bg-[#142417]">
      
      <!-- Pixpa Aspect Signature: Full-Width Cinematic Hero Cover -->
      <div 
        appScrollReveal
        class="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        <div class="relative w-full h-[75vh] sm:h-[82vh] lg:h-[86vh] min-h-[540px] max-h-[950px] rounded-2xl sm:rounded-3xl overflow-hidden group shadow-2xl bg-[#142417] border border-[#86DEB7]/40">
          
          <!-- Grand Editorial Cover Image -->
          <img
            [src]="shop.heroPhoto().imageUrl || defaultCover"
            [alt]="shop.heroPhoto().title || 'Fotografía de Julieta Marateo'"
            fetchpriority="high"
            decoding="async"
            class="w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out group-hover:scale-[1.015]"/>
          
          <!-- Cinematic Gradient Scrim (Dark green at bottom, transparent above) -->
          <div class="absolute inset-0 bg-gradient-to-t from-[#142417]/95 via-[#142417]/35 to-transparent"></div>
          
        
          <!-- Bottom Caption / Title / Claim (Aspect Style) -->
          <div class="absolute bottom-8 left-6 right-6 sm:bottom-12 sm:left-12 sm:right-12 z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div class="space-y-2 max-w-3xl text-left">
              
              <h1 class="font-editorial text-3xl sm:text-5xl lg:text-6xl text-[#86DEB7] font-bold leading-tight drop-shadow-lg tracking-tight">
               Fotografía
              </h1>

              <p class="font-editorial text-lg sm:text-2xl italic text-[#86DEB7]/90 font-normal drop-shadow-md">
               de moda, paisajismo, producto · la luz & la emoción
              </p>

           
              
            </div>

            <!-- Action Controls -->
            <div class="flex items-center gap-3 flex-shrink-0">
              <a
                href="/#albumes"
                class="btn-editorial-mint px-6 py-2.5 rounded-full text-xs font-sans font-bold uppercase tracking-[0.2em] transition-all shadow-xl">
                Explorar Obras
              </a>

              @if (auth.isAdmin()) {
                <button
                  type="button"
                  (click)="shop.openAdminDashboard('photos')"
                  title="Elegir otra foto como Portada Hero en el panel de control"
                  class="px-4 py-2.5 rounded-full bg-[#63B995] hover:bg-[#86DEB7] text-[#142417] border border-[#86DEB7] text-xs font-sans font-bold uppercase tracking-wider transition-all backdrop-blur-sm flex items-center gap-1.5 shadow-md">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  <span>Cambiar Portada</span>
                </button>
              }
            </div>
          </div>

        </div>

      </div>
    </section>
  `
})
export class HeroComponent {
  readonly shop = inject(ShopService);
  readonly auth = inject(AuthService);

  readonly defaultCover = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=85';
}
