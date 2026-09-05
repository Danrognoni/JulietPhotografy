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
    <section id="inicio" class="relative pt-20 sm:pt-24 w-full overflow-hidden bg-[#0a0712]">
      
      <!-- Pixpa Aspect Signature: Full-Width Cinematic Hero Cover -->
      <div 
        appScrollReveal
        class="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        <div class="relative w-full h-[75vh] sm:h-[82vh] lg:h-[86vh] min-h-[540px] max-h-[950px] rounded-2xl sm:rounded-3xl overflow-hidden group shadow-2xl bg-[#0e0a1b]">
          
          <!-- Grand Editorial Cover Image -->
          <img
            [src]="shop.heroPhoto().imageUrl || defaultCover"
            [alt]="shop.heroPhoto().title || 'Fotografía de Julieta Marateo'"
            fetchpriority="high"
            decoding="async"
            class="w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out group-hover:scale-[1.015]"/>
          
          <!-- Cinematic Gradient Scrim (Dark at bottom, transparent above) -->
          <div class="absolute inset-0 bg-gradient-to-t from-[#0a0712]/95 via-[#0a0712]/25 to-transparent"></div>
          
          <!-- Top Badge: Category & Location -->
          <div class="absolute top-6 left-6 sm:top-8 sm:left-8 z-10">
            <span class="px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em]">
              {{ shop.heroPhoto().category }} · Mar del Plata
            </span>
          </div>

          <!-- Bottom Caption / Title / Claim (Aspect Style) -->
          <div class="absolute bottom-8 left-6 right-6 sm:bottom-12 sm:left-12 sm:right-12 z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div class="space-y-2 max-w-3xl text-left">
              
              <h1 class="font-editorial text-3xl sm:text-5xl lg:text-6xl text-white font-light leading-tight drop-shadow-lg tracking-tight">
                {{ shop.heroPhoto().title }}
              </h1>

              <p class="font-editorial text-lg sm:text-2xl italic text-slate-200 font-normal drop-shadow-md">
                Fotógrafa de moda, paisajismo, producto · la luz & la emoción
              </p>

              @if (shop.heroPhoto().technicalSheet) {
                <p class="text-[11px] font-mono text-slate-400/90 tracking-wider">
                  {{ shop.heroPhoto().technicalSheet }}
                </p>
              }
            </div>

            <!-- Action Controls -->
            <div class="flex items-center gap-3 flex-shrink-0">
              <a
                href="/#albumes"
                class="px-6 py-2.5 rounded-full bg-white text-slate-950 hover:bg-slate-200 text-xs font-sans font-semibold uppercase tracking-[0.2em] transition-all shadow-xl">
                Explorar Obras
              </a>

              @if (auth.isAdmin()) {
                <button
                  type="button"
                  (click)="shop.openAdminDashboard('photos')"
                  title="Elegir otra foto como Portada Hero en el panel de control"
                  class="px-4 py-2.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-sans uppercase tracking-wider transition-all backdrop-blur-sm flex items-center gap-1.5">
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
