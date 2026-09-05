import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShopService } from '../../services/shop.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section id="inicio" class="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      
      <!-- Subtle Ambient Soft Aura Glows -->
      <div class="absolute top-20 left-10 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none"></div>
      <div class="absolute top-40 right-10 w-[450px] h-[450px] rounded-full bg-sky-500/10 blur-[130px] pointer-events-none"></div>
      <div class="absolute bottom-10 left-1/3 w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[140px] pointer-events-none"></div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Revel Editorial Masthead & Headline -->
        <div class="text-center max-w-4xl mx-auto mb-12 lg:mb-16 space-y-4">
          

          <h1 class="font-editorial text-4xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.08] tracking-tight">
            Fotografa de moda, paisajismo, producto. <span class="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-sky-200 to-violet-300">luz & la emoción</span>
          </h1>

         

          <!-- Primary Actions -->
          <div class="pt-3 flex flex-wrap items-center justify-center gap-3.5">
            <a href="/#albumes"
               class="btn-editorial-mint px-7 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase flex items-center gap-2 shadow-lg">
              <span>Explorar Álbumes</span>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>

            <a href="/#servicios"
               class="btn-aura-outline px-6 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all">
              Ver Servicios
            </a>

            @if (auth.isAdmin()) {
              <button
                type="button"
                (click)="shop.openAdminDashboard('photos')"
                class="px-4 py-3 rounded-full bg-[#180a32]/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-950/60 transition-colors flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                <span>Gestionar Fotos</span>
              </button>
            }
          </div>
        </div>

        <!-- Revel Signature: Asymmetrical Editorial Photo Grid (Dynamic from catalog) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
          
          <!-- Column 1: Vertical Masterpiece (Featured Casamiento / Retrato) -->
          <div class="lg:col-span-4 relative group">
            <div class="album-card-editorial overflow-hidden shadow-2xl h-[420px] sm:h-[480px]">
              <img
                [src]="featuredPhoto1()?.imageUrl || defaultCover1"
                [alt]="featuredPhoto1()?.title || 'Fotografía de Autor'"
                loading="lazy"
                decoding="async"
                class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"/>
              <div class="absolute inset-0 bg-gradient-to-t from-[#090514]/90 via-[#090514]/20 to-transparent"></div>
              
              <div class="absolute bottom-5 left-5 right-5 space-y-1 text-left">
                <span class="inline-block px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold uppercase tracking-widest">
                  {{ featuredPhoto1()?.category || 'Casamientos' }}
                </span>
                <h3 class="font-editorial text-2xl text-white font-normal leading-snug drop-shadow-md">
                  {{ featuredPhoto1()?.title || 'Promesa al Atardecer' }}
                </h3>
                <p class="text-xs text-slate-300/80 line-clamp-1 font-sans">
                  {{ featuredPhoto1()?.dimensions || 'Fine Art 310g' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Column 2: Centerpiece Landscape -->
          <div class="lg:col-span-5 relative group">
            <div class="album-card-editorial overflow-hidden shadow-2xl h-[420px] sm:h-[480px]">
              <img
                [src]="featuredPhoto2()?.imageUrl || defaultCover2"
                [alt]="featuredPhoto2()?.title || 'Paisajes de Mar del Plata'"
                loading="lazy"
                decoding="async"
                class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"/>
              <div class="absolute inset-0 bg-gradient-to-t from-[#090514]/90 via-[#090514]/15 to-transparent"></div>
              
              <div class="absolute bottom-5 left-5 right-5 space-y-1 text-left">
                <span class="inline-block px-2.5 py-0.5 rounded-full bg-sky-950/80 border border-sky-400/40 text-sky-300 text-[10px] font-bold uppercase tracking-widest">
                  {{ featuredPhoto2()?.category || 'Paisajismo' }}
                </span>
                <h3 class="font-editorial text-2xl sm:text-3xl text-white font-normal leading-snug drop-shadow-md">
                  {{ featuredPhoto2()?.title || 'Amanecer en los Acantilados' }}
                </h3>
                <p class="text-xs text-slate-300/80 line-clamp-1 font-sans">
                  {{ featuredPhoto2()?.dimensions || 'Impresión Fine Art' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Column 3: Offset Companion Image (XV / Eventos) -->
          <div class="lg:col-span-3 relative group">
            <div class="album-card-editorial overflow-hidden shadow-2xl h-[420px] sm:h-[480px]">
              <img
                [src]="featuredPhoto3()?.imageUrl || defaultCover3"
                [alt]="featuredPhoto3()?.title || 'Quinceañeras & Eventos'"
                loading="lazy"
                decoding="async"
                class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"/>
              <div class="absolute inset-0 bg-gradient-to-t from-[#090514]/90 via-[#090514]/15 to-transparent"></div>
              
              <div class="absolute bottom-5 left-5 right-5 space-y-1 text-left">
                <span class="inline-block px-2.5 py-0.5 rounded-full bg-fuchsia-950/80 border border-fuchsia-400/40 text-fuchsia-300 text-[10px] font-bold uppercase tracking-widest">
                  {{ featuredPhoto3()?.category || 'Eventos' }}
                </span>
                <h3 class="font-editorial text-xl text-white font-normal leading-snug drop-shadow-md">
                  {{ featuredPhoto3()?.title || 'Brillo de Quinceañera' }}
                </h3>
                <p class="text-xs text-slate-300/80 line-clamp-1 font-sans">
                  {{ featuredPhoto3()?.dimensions || 'Papel Lustre' }}
                </p>
              </div>
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

  readonly defaultCover1 = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85';
  readonly defaultCover2 = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85';
  readonly defaultCover3 = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85';

  readonly featuredPhoto1 = computed(() => {
    const photos = this.shop.photos();
    return photos.find(p => p.badge?.toLowerCase().includes('casamiento') || p.category === 'Eventos') || photos[2] || photos[0];
  });

  readonly featuredPhoto2 = computed(() => {
    const photos = this.shop.photos();
    return photos.find(p => p.category === 'Paisajismo') || photos[0];
  });

  readonly featuredPhoto3 = computed(() => {
    const photos = this.shop.photos();
    return photos.find(p => p.badge?.toLowerCase().includes('quince') || p.category === 'Foto Producto') || photos[4] || photos[1];
  });
}
