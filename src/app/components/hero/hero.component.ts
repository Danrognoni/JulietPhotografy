import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="inicio" class="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      <!-- Ambient Violet Gradient Background with layered atmospheric blur -->
      <div class="absolute inset-0 pointer-events-none z-0">
        <!-- Deep radial violet gradient spots -->
        <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-purple-700/20 rounded-full blur-[140px] animate-pulse"></div>
        <div class="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-fuchsia-800/15 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-violet-900/25 rounded-full blur-[130px]"></div>
        
        <!-- Subtle subtle grid pattern overlay -->
        <div class="absolute inset-0 bg-[linear-gradient(to_right,#805ad508_1px,transparent_1px),linear-gradient(to_bottom,#805ad508_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        <!-- Hero Background Landscape Image with dark violet mask -->
        <div class="absolute inset-0 opacity-25 mix-blend-screen bg-cover bg-center filter saturate-150 brightness-75"
             style="background-image: url('https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1920&q=80');">
        </div>
        <div class="absolute inset-0 bg-gradient-to-b from-[#090312]/90 via-[#090312]/75 to-[#090312]"></div>
      </div>

      <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <!-- Top Pill Tag -->
        <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-200 text-xs sm:text-sm font-medium tracking-wider mb-8 backdrop-blur-md shadow-lg shadow-purple-950/50">
          <span class="w-2 h-2 rounded-full bg-fuchsia-400 animate-ping"></span>
          <span>COLECCIÓN FINE ART 2026</span>
          <span class="text-purple-400">·</span>
          <span class="text-purple-300/80 font-light">PAISAJES & PRODUCTO</span>
        </div>

        <!-- Main Headline -->
        <h1 class="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white leading-[1.08] mb-6">
          Capturando la <br class="hidden sm:inline">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-purple-400 to-fuchsia-400">
            esencia del mundo
          </span>
        </h1>

        <!-- Editorial Subtitle -->
        <p class="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-purple-200/80 font-light leading-relaxed mb-10">
          Obras fotográficas de autor que transforman espacios. Impresiones de museo en papel baritado 100% algodón y licencias comerciales de máxima fidelidad óptica.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-14">
          <!-- Primary CTA (Vibrant Neon Violet) -->
          <a href="#galeria"
             class="btn-neon-violet px-8 py-4 rounded-2xl text-base font-bold tracking-wide flex items-center justify-center gap-3 w-full sm:w-auto group">
            <span>Explorar Tienda</span>
            <svg class="w-5 h-5 transform group-hover:translate-x-1.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>

          <!-- Secondary Action (Upload Simulation Trigger) -->
          <button (click)="shop.openUploadModal()"
             class="px-7 py-4 rounded-2xl text-base font-medium text-purple-200 hover:text-white bg-purple-950/40 hover:bg-purple-900/40 border border-purple-700/40 hover:border-purple-500/60 backdrop-blur-md transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2.5">
            <svg class="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span>Subir Nueva Fotografía</span>
          </button>
        </div>

        <!-- Trust Badges & Metrics in Soft Lilac / Muted Violet -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 border-t border-purple-900/30 max-w-4xl mx-auto">
          <div class="p-3 text-center">
            <div class="font-display text-2xl sm:text-3xl font-bold text-white mb-1">Hahnemühle</div>
            <div class="text-xs text-purple-300/70 font-light">Papel Museo 310g</div>
          </div>
          <div class="p-3 text-center">
            <div class="font-display text-2xl sm:text-3xl font-bold text-white mb-1">100+ Mpx</div>
            <div class="text-xs text-purple-300/70 font-light">Medio Formato & 8K</div>
          </div>
          <div class="p-3 text-center">
            <div class="font-display text-2xl sm:text-3xl font-bold text-white mb-1">Limitadas</div>
            <div class="text-xs text-purple-300/70 font-light">Certificado de Autor</div>
          </div>
          <div class="p-3 text-center">
            <div class="font-display text-2xl sm:text-3xl font-bold text-white mb-1">Global</div>
            <div class="text-xs text-purple-300/70 font-light">Envíos Asegurados</div>
          </div>
        </div>

      </div>

      <!-- Bottom Fade to Content -->
      <div class="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#090312] to-transparent pointer-events-none"></div>
    </section>
  `
})
export class HeroComponent {
  readonly shop = inject(ShopService);
}
