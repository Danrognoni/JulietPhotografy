import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, switchMap, map } from 'rxjs';
import { 
  Photo, 
  PhotoCategory, 
  ServiceItem, 
  ProfileData, 
  CartItem, 
  AlbumFolder, 
  CoverPhoto,
  CheckoutPreferenceResponse,
  OrderRequest,
  OrderItemRequest,
  OrderItemResult,
  OrderResult,
  Order,
  OrderStatus
} from '../models/photo.model';
import { AuthService } from './auth.service';
import { ViewportScrollService } from './viewport-scroll.service';
import { environment } from '../../environments/environment';

export type { 
  CheckoutPreferenceResponse, 
  OrderRequest, 
  OrderItemRequest, 
  OrderItemResult, 
  OrderResult, 
  Order, 
  OrderStatus 
};

export interface AppAlert {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);
  readonly viewportScroll = inject(ViewportScrollService);

  readonly defaultWhatsAppUrl = 'https://wa.me/5492281311917?text=Hola%20Julieta,%20vengo%20de%20tu%20sitio%20web%20y%20me%20gustar%C3%ADa%20agendar%20una%20cita.';
  readonly defaultInstagramUrl = 'https://www.instagram.com/julietamph_/';
  readonly defaultInstagramHandle = '@julietamph_';

  // Initial curated photography catalog (fallback si el backend no está disponible)
  private readonly defaultPhotos: Photo[] = [
    {
      id: 'photo-1',
      title: 'Amanecer en los Acantilados',
      category: 'Paisajismo',
      price: 130,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
      description: 'Luz dorada matutina sobre la costa marítima de Mar del Plata, capturando la inmensidad del océano Atlántico y el romper de las olas.',
      dimensions: '75 x 50 cm · Impresión Fine Art',
      technicalSheet: 'Sony Alpha 7 IV · FE 24-70mm f/2.8 GM II · f/8.0 · 1/250s · ISO 100',
      cameraDetails: {
        camera: 'Sony Alpha 7 IV',
        lens: 'FE 24-70mm f/2.8 GM II',
        aperture: 'f/8.0',
        shutter: '1/250s',
        iso: 'ISO 100'
      },
      inStock: true,
      badge: 'Mar del Plata'
    },
    {
      id: 'photo-2',
      title: 'Esencia Botánica & Vidrio',
      category: 'Foto Producto',
      price: 90,
      imageUrl: 'https://images.unsplash.com/photo-1608248597359-28c049e048ea?auto=format&fit=crop&w=1200&q=85',
      description: 'Fotografía comercial publicitaria de cosmética natural con iluminación controlada de estudio, texturas acuáticas y reflejos sutiles.',
      dimensions: '40 x 40 cm · Alta Definición',
      technicalSheet: 'Canon EOS R5 · RF 100mm f/2.8L Macro IS · f/11 · 1/160s · ISO 64',
      cameraDetails: {
        camera: 'Canon EOS R5',
        lens: 'RF 100mm f/2.8L Macro IS',
        aperture: 'f/11',
        shutter: '1/160s',
        iso: 'ISO 64'
      },
      inStock: true,
      badge: 'Editorial'
    },
    {
      id: 'photo-3',
      title: 'Promesa al Atardecer',
      category: 'Eventos',
      price: 150,
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
      description: 'Momento íntimo de casamiento al aire libre. La calidez del atardecer abrazando la complicidad y el amor de la pareja.',
      dimensions: '60 x 40 cm · Fine Art 310g',
      technicalSheet: 'Sony Alpha 7R V · FE 85mm f/1.4 GM · f/1.8 · 1/800s · ISO 125',
      cameraDetails: {
        camera: 'Sony Alpha 7R V',
        lens: 'FE 85mm f/1.4 GM',
        aperture: 'f/1.8',
        shutter: '1/800s',
        iso: 'ISO 125'
      },
      inStock: true,
      badge: 'Casamiento'
    },
    {
      id: 'photo-4',
      title: 'Dunas & Horizonte Costero',
      category: 'Paisajismo',
      price: 115,
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
      description: 'Paisaje salvaje de dunas y cielo despejado. Tonos naturales y sensación de calma infinita.',
      dimensions: '80 x 50 cm · Lienzo Montado',
      technicalSheet: 'Nikon Z8 · NIKKOR Z 14-30mm f/4 S · f/9.0 · 1/125s · ISO 64',
      cameraDetails: {
        camera: 'Nikon Z8',
        lens: 'NIKKOR Z 14-30mm f/4 S',
        aperture: 'f/9.0',
        shutter: '1/125s',
        iso: 'ISO 64'
      },
      inStock: true
    },
    {
      id: 'photo-5',
      title: 'Brillo de Quinceañera',
      category: 'Eventos',
      price: 140,
      imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
      description: 'Sesión fotográfica de XV años en exteriores. Captura natural de la emoción y el protagonismo de la homenajeada.',
      dimensions: '50 x 75 cm · Papel Lustre',
      technicalSheet: 'Fujifilm X-T5 · XF 56mm f/1.2 R WR · f/1.4 · 1/1000s · ISO 160',
      cameraDetails: {
        camera: 'Fujifilm X-T5',
        lens: 'XF 56mm f/1.2 R WR',
        aperture: 'f/1.4',
        shutter: '1/1000s',
        iso: 'ISO 160'
      },
      inStock: true,
      badge: 'Quince Años'
    },
    {
      id: 'photo-6',
      title: 'Café de Especialidad & Cerámica',
      category: 'Foto Producto',
      price: 85,
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85',
      description: 'Fotografía gastronómica y de producto para cafetería de especialidad en Mar del Plata. Textura de café filtrado y luz natural cenital.',
      dimensions: '45 x 30 cm · Giclée Print',
      technicalSheet: 'Sony Alpha 7 IV · FE 50mm f/1.2 GM · f/2.2 · 1/400s · ISO 200',
      cameraDetails: {
        camera: 'Sony Alpha 7 IV',
        lens: 'FE 50mm f/1.2 GM',
        aperture: 'f/2.2',
        shutter: '1/400s',
        iso: 'ISO 200'
      },
      inStock: true
    },
    {
      id: 'photo-7',
      title: 'Viento & Olas en Playa Grande',
      category: 'Paisajismo',
      price: 125,
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=85',
      description: 'La fuerza del mar marplatense en una tarde de brisa marina. Tonos verde agua, espuma blanca y cielo límpido.',
      dimensions: '90 x 60 cm · Aluminio Mate',
      technicalSheet: 'Sony Alpha 7 IV · FE 70-200mm f/2.8 GM OSS II · f/5.6 · 1/1000s · ISO 160',
      cameraDetails: {
        camera: 'Sony Alpha 7 IV',
        lens: 'FE 70-200mm f/2.8 GM OSS II',
        aperture: 'f/5.6',
        shutter: '1/1000s',
        iso: 'ISO 160'
      },
      inStock: true,
      badge: 'Costa Atlántica'
    },
    {
      id: 'photo-8',
      title: 'Celebración & Luz Cálida',
      category: 'Eventos',
      price: 135,
      imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=85',
      description: 'Detalle de mesa principal y ambientación de evento social con guirnaldas de luces y flores frescas.',
      dimensions: '50 x 50 cm · Papel Museo 310g',
      technicalSheet: 'Canon EOS R6 Mark II · RF 35mm f/1.8 IS Macro · f/2.0 · 1/160s · ISO 800',
      cameraDetails: {
        camera: 'Canon EOS R6 Mark II',
        lens: 'RF 35mm f/1.8 IS Macro',
        aperture: 'f/2.0',
        shutter: '1/160s',
        iso: 'ISO 800'
      },
      inStock: true
    },
    {
      id: 'photo-9',
      title: 'Reloj Cronógrafo de Lujo',
      category: 'Foto Producto',
      price: 110,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
      description: 'Macrofotografía de alta relojería. Detalles minuciosos de titanio, bisel cerámico y reflejos de luz rasante.',
      dimensions: '40 x 40 cm · Fine Art Baritado',
      technicalSheet: 'Hasselblad 907X · XCD 120mm Macro · f/16 · 1/125s · ISO 100',
      cameraDetails: {
        camera: 'Hasselblad 907X',
        lens: 'XCD 120mm Macro',
        aperture: 'f/16',
        shutter: '1/125s',
        iso: 'ISO 100'
      },
      inStock: true
    }
  ];

  // Initial Services list
  private readonly defaultServices: ServiceItem[] = [
    {
      id: 'serv-1',
      title: 'Casamientos',
      description: 'Cobertura fotográfica integral y sensible para el día de tu boda. Acompañamos desde los preparativos hasta el último baile, capturando emociones genuinas con estética cinematográfica.',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      features: [
        'Preparativos (Getting Ready) de los novios',
        'Ceremonia religiosa o civil & sesión de pareja',
        'Cobertura de fiesta y momentos espontáneos',
        'Galería digital privada en alta resolución & fotos editadas'
      ],
      whatsappUrl: this.defaultWhatsAppUrl
    },
    {
      id: 'serv-2',
      title: 'Cumpleaños de XV',
      description: 'Un recuerdo mágico para celebrar los 15 años. Realizamos sesiones de exteriores previas llenas de frescura y estilo, además de la cobertura completa de la fiesta.',
      imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      features: [
        'Sesión previa en locaciones de Mar del Plata',
        'Cobertura completa de la fiesta y vals',
        'Retoque estético profesional individual',
        'Entrega ágil en pendrive y galería web protegida'
      ],
      whatsappUrl: this.defaultWhatsAppUrl
    },
    {
      id: 'serv-3',
      title: 'Eventos en General',
      description: 'Coberturas para celebraciones corporativas, aniversarios, cumpleaños familiares, bautismos y recitales. Registro dinámico y profesional con máxima fidelidad visual.',
      imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      features: [
        'Eventos sociales, culturales y corporativos',
        'Tomas espontáneas, detalles y fotos grupales',
        'Postproducción y corrección de color profesional',
        'Planificación personalizada de tiempos y momentos clave'
      ],
      whatsappUrl: this.defaultWhatsAppUrl
    }
  ];

  // Initial Profile Data
  private readonly defaultProfile: ProfileData = {
    name: 'Julieta Marateo',
    title: 'Técnica en Fotografía',
    location: 'Mar del Plata, Argentina',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
    bio: 'Hola, mi nombre es Julieta Marateo. Soy Técnica en Fotografía radicada en Mar del Plata. Me apasiona capturar momentos únicos, encargándome con máxima dedicación tanto de la toma fotográfica como de la postproducción y edición profesional. Ofrezco coberturas para casamientos, cumpleaños de XV y eventos en general, garantizando un recuerdo imborrable con la mejor calidad visual.',
    whatsapp: '2281311917',
    email: 'julietamarateo4@gmail.com',
    instagram: '@julietamph_',
    tags: ['Casamientos', 'Cumpleaños de XV', 'Eventos Sociales & Corporativos', 'Retoque & Postproducción']
  };

  // State Signals (Álbumes y Portada persistidos desde backend)
  readonly photos = signal<Photo[]>(this.loadStorage('jm_photos', this.defaultPhotos));
  readonly services = signal<ServiceItem[]>(this.loadStorage('jm_services', this.defaultServices));
  readonly profile = signal<ProfileData>(this.loadStorage('jm_profile', this.defaultProfile));
  readonly albums = signal<AlbumFolder[]>(this.loadStorage('jm_custom_albums', []));
  readonly coverPhoto = signal<CoverPhoto | null>(this.loadStorage('jm_cover_photo', null));

  readonly selectedCategory = signal<PhotoCategory | 'Todos'>('Todos');
  readonly searchQuery = signal<string>('');
  readonly heroPhotoId = signal<string>(this.loadStorage<string>('jm_hero_photo_id', ''));
  
  readonly cart = signal<CartItem[]>([]);
  readonly isCartOpen = signal<boolean>(false);
  readonly selectedPhoto = signal<Photo | null>(null);
  readonly isAdminDashboardOpen = signal<boolean>(false);
  readonly adminInitialTab = signal<'photos' | 'albums' | 'services' | 'profile'>('photos');

  // Global Alert & Selection Signals
  readonly globalAlert = signal<AppAlert | null>(null);
  readonly editingPhoto = signal<Photo | null>(null);
  readonly editingService = signal<ServiceItem | null>(null);
  readonly editingAlbum = signal<AlbumFolder | null>(null);

  constructor() {
    // Sincronizar automáticamente con el backend Spring Boot al iniciar en el cliente
    if (typeof window !== 'undefined') {
      this.syncWithBackend();
    }
  }

  /**
   * Carga los datos reales desde la API de Spring Boot y actualiza los Signals reactivos.
   */
  syncWithBackend(): void {
    // 1. Fotos
    this.http.get<Photo[]>(`${environment.apiUrl}/photos`).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          const mapped = data.map(p => ({
            ...p,
            imageUrl: this.normalizeImageUrl(p.imageUrl)
          }));
          this.photos.set(mapped);
          this.saveStorage('jm_photos', mapped);
        }
      },
      error: (err) => console.info('Backend /api/photos no conectado, operando con catálogo en caché:', err?.status)
    });

    // 2. Servicios
    this.http.get<ServiceItem[]>(`${environment.apiUrl}/services`).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          const mapped = data.map(s => ({
            ...s,
            imageUrl: this.normalizeImageUrl(s.imageUrl)
          }));
          this.services.set(mapped);
          this.saveStorage('jm_services', mapped);
        }
      },
      error: (err) => console.info('Backend /api/services no conectado, operando con caché:', err?.status)
    });

    // 3. Perfil
    this.http.get<ProfileData>(`${environment.apiUrl}/profile`).subscribe({
      next: (data) => {
        if (data) {
          const mapped: ProfileData = {
            ...data,
            tags: data.tags && data.tags.length > 0 ? data.tags : (this.profile().tags || []),
            imageUrl: this.normalizeImageUrl(data.imageUrl)
          };
          this.profile.set(mapped);
          this.saveStorage('jm_profile', mapped);
        }
      },
      error: (err) => console.info('Backend /api/profile no conectado, operando con caché:', err?.status)
    });

    // 4. Álbumes Temáticos (Persistencia completa)
    this.http.get<AlbumFolder[]>(`${environment.apiUrl}/albums`).subscribe({
      next: (data) => {
        if (data) {
          const mapped = data.map(a => ({
            ...a,
            coverImage: this.normalizeImageUrl(a.coverImage)
          }));
          this.albums.set(mapped);
          this.saveStorage('jm_custom_albums', mapped);
        }
      },
      error: (err) => console.info('Backend /api/albums no conectado, operando con caché:', err?.status)
    });

    // 5. Foto de Portada Hero (Persistencia completa)
    this.http.get<CoverPhoto>(`${environment.apiUrl}/cover-photo`).subscribe({
      next: (data) => {
        if (data) {
          const mapped: CoverPhoto = {
            ...data,
            imageUrl: this.normalizeImageUrl(data.imageUrl)
          };
          this.coverPhoto.set(mapped);
          if (mapped.photoId) {
            this.heroPhotoId.set(mapped.photoId);
            this.saveStorage('jm_hero_photo_id', mapped.photoId);
          }
          this.saveStorage('jm_cover_photo', mapped);
        }
      },
      error: (err) => console.info('Backend /api/cover-photo no conectado, operando con caché:', err?.status)
    });
  }

  private normalizeImageUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('/uploads/')) {
      return `${environment.uploadsUrl}${url}`;
    }
    return url;
  }

  // Computed state
  // Computed Albums / Folders based on albums signal and photos
  readonly albumFolders = computed<AlbumFolder[]>(() => {
    const all = this.photos();
    const currentAlbums = this.albums();

    return currentAlbums.map(album => {
      const matching = all.filter(p => {
        const catMatch = p.category?.trim().toLowerCase() === album.name.trim().toLowerCase();
        const badgeMatch = (album.name === 'Casamientos' && p.badge?.toLowerCase().includes('casamiento')) ||
                           (album.name === 'Cumpleaños XV' && p.badge?.toLowerCase().includes('quince'));
        return Boolean(catMatch || badgeMatch);
      });

      const cover = album.coverImage || (matching.length > 0 ? matching[0].imageUrl : '');

      return {
        ...album,
        category: album.name,
        coverImage: cover,
        count: matching.length
      };
    });
  });

  readonly albumCategories = computed<string[]>(() => {
    const list = this.albums().map(a => a.name.trim());
    return Array.from(new Set(list));
  });

  // Computed state
  readonly filteredPhotos = computed(() => {
    const category = this.selectedCategory();
    const query = this.searchQuery().toLowerCase().trim();
    const all = this.photos();

    return all.filter(photo => {
      let matchesCategory = category === 'Todos' || photo.category === category;
      if (!matchesCategory) {
        if (category === 'Casamientos' && photo.badge?.toLowerCase().includes('casamiento')) matchesCategory = true;
        if (category === 'Cumpleaños XV' && photo.badge?.toLowerCase().includes('quince')) matchesCategory = true;
      }

      const matchesSearch = query === '' ||
        photo.title.toLowerCase().includes(query) ||
        photo.description.toLowerCase().includes(query) ||
        photo.technicalSheet.toLowerCase().includes(query) ||
        photo.category.toLowerCase().includes(query) ||
        (photo.badge && photo.badge.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  });

  readonly cartCount = computed(() => {
    return this.cart().reduce((total, item) => total + item.quantity, 0);
  });

  readonly cartTotal = computed(() => {
    return this.cart().reduce((total, item) => total + (item.photo.price * item.quantity), 0);
  });

  readonly heroPhoto = computed<Photo>(() => {
    const list = this.photos();
    const cover = this.coverPhoto();
    const customId = this.heroPhotoId() || cover?.photoId;

    if (customId) {
      const found = list.find(p => p.id === customId);
      if (found) {
        if (cover?.imageUrl && cover.imageUrl !== found.imageUrl) {
          return {
            ...found,
            imageUrl: this.normalizeImageUrl(cover.imageUrl),
            title: cover.title || found.title
          };
        }
        return found;
      }
    }

    if (cover && cover.imageUrl) {
      return {
        id: cover.photoId || 'cover-hero',
        title: cover.title || 'Fotografía de Julieta Marateo',
        category: (cover.category || 'Fotografía Profesional') as PhotoCategory,
        price: 0,
        imageUrl: this.normalizeImageUrl(cover.imageUrl),
        description: cover.description || '',
        dimensions: '',
        technicalSheet: '',
        inStock: true
      };
    }

    const featured = list.find(p => p.featured ||
      p.badge?.toLowerCase().includes('hero') ||
      p.badge?.toLowerCase().includes('portada') ||
      p.badge?.toLowerCase().includes('destacada')
    );
    if (featured) return featured;
    return list[0] || this.defaultPhotos[0];
  });

  setHeroCover(photoId: string, customUrl?: string, file?: File): Observable<CoverPhoto> {
    const headers = this.getAuthHeaders();
    const photo = this.photos().find(p => p.id === photoId);
    const resolvedUrl = customUrl || photo?.imageUrl || '';

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      if (photoId) formData.append('photoId', photoId);
      if (resolvedUrl) formData.append('imageUrl', resolvedUrl);
      if (photo?.title) formData.append('title', photo.title);
      if (photo?.category) formData.append('category', photo.category);
      if (photo?.description) formData.append('description', photo.description);

      return this.http.put<CoverPhoto>(`${environment.apiUrl}/cover-photo`, formData, { headers }).pipe(
        tap((saved) => {
          const mapped: CoverPhoto = {
            ...saved,
            imageUrl: this.normalizeImageUrl(saved.imageUrl)
          };
          this.coverPhoto.set(mapped);
          this.heroPhotoId.set(mapped.photoId || photoId);
          this.saveStorage('jm_cover_photo', mapped);
          this.saveStorage('jm_hero_photo_id', mapped.photoId || photoId);
          this.showAlert('success', 'Fotografía asignada como Portada Principal del Hero');
        })
      );
    } else {
      const payload: CoverPhoto = {
        photoId: photoId || undefined,
        imageUrl: resolvedUrl,
        title: photo?.title || undefined,
        category: photo?.category || undefined,
        description: photo?.description || undefined
      };

      return this.http.put<CoverPhoto>(`${environment.apiUrl}/cover-photo`, payload, { headers }).pipe(
        tap((saved) => {
          const mapped: CoverPhoto = {
            ...saved,
            imageUrl: this.normalizeImageUrl(saved.imageUrl)
          };
          this.coverPhoto.set(mapped);
          this.heroPhotoId.set(mapped.photoId || photoId);
          this.saveStorage('jm_cover_photo', mapped);
          this.saveStorage('jm_hero_photo_id', mapped.photoId || photoId);
          this.showAlert('success', 'Fotografía asignada como Portada Principal del Hero');
        })
      );
    }
  }

  private loadStorage<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      const parsed = JSON.parse(item);
      if (key === 'jm_profile' && parsed && (!parsed.tags || parsed.tags.length === 0)) {
        parsed.tags = (fallback as any).tags || ['Casamientos', 'Cumpleaños de XV', 'Eventos Sociales & Corporativos', 'Retoque & Postproducción'];
      }
      return parsed;
    } catch {
      return fallback;
    }
  }

  private saveStorage(key: string, value: any): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error guardando en localStorage:', e);
    }
  }

  // Filter & Search Actions
  setCategory(category: PhotoCategory | 'Todos'): void {
    this.selectedCategory.set(category);
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  // --- ALERTAS GLOBALES & HELPER DE ERRORES ---
  showAlert(type: 'error' | 'success' | 'warning' | 'info', message: string, durationMs: number = 6500): void {
    this.globalAlert.set({ type, message });
    if (durationMs > 0) {
      setTimeout(() => {
        if (this.globalAlert()?.message === message) {
          this.globalAlert.set(null);
        }
      }, durationMs);
    }
  }

  clearAlert(): void {
    this.globalAlert.set(null);
  }

  startEditingPhoto(photo: Photo): void {
    this.editingPhoto.set(photo);
    this.openAdminDashboard('photos');
    this.scrollToTop(true);
  }

  startEditingService(service: ServiceItem): void {
    this.editingService.set(service);
    this.openAdminDashboard('services');
    this.scrollToTop(true);
  }

  /**
   * Genera un mensaje de error limpio, amigable y explicativo según el código de respuesta HTTP.
   */
  getCleanErrorMessage(error: any, actionName: string): string {
    if (!error) {
      return `Ocurrió un error inesperado al ${actionName}.`;
    }

    // CORS o servidor inaccesible (código 0)
    if (error.status === 0) {
      return `Error de conexión o CORS (código 0): No se pudo comunicar con el backend Spring Boot (http://localhost:8080). ` +
             `Verifica que el servidor esté encendido y que la configuración de CORS admita este origen.`;
    }

    // 403 Forbidden
    if (error.status === 403) {
      return `Acceso denegado (403 Forbidden): Tu sesión ha expirado o no cuentas con los permisos de Administrador requeridos para ${actionName}. ` +
             `Por favor, inicia sesión nuevamente.`;
    }

    // 401 Unauthorized
    if (error.status === 401) {
      return `No autorizado (401 Unauthorized): Se requiere un token JWT válido para ${actionName}. Por favor inicia sesión como Administradora.`;
    }

    // 404 Not Found
    if (error.status === 404) {
      return `Recurso no encontrado (404): El registro para ${actionName} no existe en el backend.`;
    }

    // 500 Internal Server Error
    if (error.status === 500) {
      const detail = error.error?.message || error.error?.error || '';
      return `Error interno del servidor (500) al ${actionName}.${detail ? ' Detalle: ' + detail : ''}`;
    }

    // Mensaje personalizado enviado por el backend
    if (error.error && typeof error.error === 'object') {
      if (error.error.message) return `Error al ${actionName}: ${error.error.message}`;
      if (error.error.error) return `Error al ${actionName}: ${error.error.error}`;
    }

    if (typeof error.error === 'string' && error.error.trim().length > 0) {
      return `Error al ${actionName}: ${error.error}`;
    }

    return `Error HTTP (${error.status || 'desconocido'}) al ${actionName}: ${error.message || 'Error al procesar la petición en el backend.'}`;
  }

  // --- HELPER DE AUTORIZACIÓN JWT ---
  getAuthHeaders(): { [header: string]: string } {
    const token = this.auth.getToken();
    return token ? { Authorization: `Bearer ${token.trim()}` } : {};
  }

  // --- CRUD FOTOS (CON PERSISTENCIA BACKEND + MULTIPART) ---
  addPhoto(newPhotoData: Omit<Photo, 'id'>, file?: File): Observable<Photo> {
    const headers = this.getAuthHeaders();
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', newPhotoData.title.trim());
      formData.append('category', newPhotoData.category);
      formData.append('price', String(newPhotoData.price));
      formData.append('dimensions', (newPhotoData.dimensions || '60 x 40 cm · Fine Art').trim());
      formData.append('technicalSheet', (newPhotoData.technicalSheet || '').trim());
      formData.append('description', (newPhotoData.description || '').trim());
      formData.append('badge', (newPhotoData.badge || 'Nuevo').trim());
      formData.append('inStock', String(newPhotoData.inStock !== false));

      if (newPhotoData.cameraDetails) {
        if (newPhotoData.cameraDetails.camera) formData.append('cameraDetails.camera', newPhotoData.cameraDetails.camera.trim());
        if (newPhotoData.cameraDetails.lens) formData.append('cameraDetails.lens', newPhotoData.cameraDetails.lens.trim());
        if (newPhotoData.cameraDetails.aperture) formData.append('cameraDetails.aperture', newPhotoData.cameraDetails.aperture.trim());
        if (newPhotoData.cameraDetails.shutter) formData.append('cameraDetails.shutter', newPhotoData.cameraDetails.shutter.trim());
        if (newPhotoData.cameraDetails.iso) formData.append('cameraDetails.iso', newPhotoData.cameraDetails.iso.trim());
      }

      return this.http.post<Photo>(`${environment.apiUrl}/photos`, formData, { headers }).pipe(
        tap((saved) => {
          const serverPhoto: Photo = {
            ...saved,
            imageUrl: this.normalizeImageUrl(saved.imageUrl)
          };
          const updated = [serverPhoto, ...this.photos().filter(p => p.id !== serverPhoto.id)];
          this.photos.set(updated);
          this.saveStorage('jm_photos', updated);
        })
      );
    } else {
      return this.http.post<Photo>(`${environment.apiUrl}/photos`, newPhotoData, { headers }).pipe(
        tap((saved) => {
          const serverPhoto: Photo = {
            ...saved,
            imageUrl: this.normalizeImageUrl(saved.imageUrl)
          };
          const updated = [serverPhoto, ...this.photos().filter(p => p.id !== serverPhoto.id)];
          this.photos.set(updated);
          this.saveStorage('jm_photos', updated);
        })
      );
    }
  }

  updatePhoto(id: string, updatedData: Partial<Photo>, file?: File): Observable<Photo> {
    const headers = this.getAuthHeaders();
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      if (updatedData.title) formData.append('title', updatedData.title.trim());
      if (updatedData.category) formData.append('category', updatedData.category);
      if (updatedData.price !== undefined) formData.append('price', String(updatedData.price));
      if (updatedData.dimensions) formData.append('dimensions', updatedData.dimensions.trim());
      if (updatedData.technicalSheet) formData.append('technicalSheet', updatedData.technicalSheet.trim());
      if (updatedData.description) formData.append('description', updatedData.description.trim());
      if (updatedData.badge) formData.append('badge', updatedData.badge.trim());
      if (updatedData.inStock !== undefined) formData.append('inStock', String(updatedData.inStock));

      if (updatedData.cameraDetails) {
        if (updatedData.cameraDetails.camera) formData.append('cameraDetails.camera', updatedData.cameraDetails.camera.trim());
        if (updatedData.cameraDetails.lens) formData.append('cameraDetails.lens', updatedData.cameraDetails.lens.trim());
        if (updatedData.cameraDetails.aperture) formData.append('cameraDetails.aperture', updatedData.cameraDetails.aperture.trim());
        if (updatedData.cameraDetails.shutter) formData.append('cameraDetails.shutter', updatedData.cameraDetails.shutter.trim());
        if (updatedData.cameraDetails.iso) formData.append('cameraDetails.iso', updatedData.cameraDetails.iso.trim());
      }

      return this.http.put<Photo>(`${environment.apiUrl}/photos/${id}`, formData, { headers }).pipe(
        tap((saved) => {
          const serverPhoto: Photo = {
            ...saved,
            imageUrl: this.normalizeImageUrl(saved.imageUrl)
          };
          const updated = this.photos().map(p => (p.id === id ? serverPhoto : p));
          this.photos.set(updated);
          this.saveStorage('jm_photos', updated);
        })
      );
    } else {
      return this.http.put<Photo>(`${environment.apiUrl}/photos/${id}`, updatedData, { headers }).pipe(
        tap((saved) => {
          const serverPhoto: Photo = {
            ...saved,
            imageUrl: this.normalizeImageUrl(saved.imageUrl)
          };
          const updated = this.photos().map(p => (p.id === id ? serverPhoto : p));
          this.photos.set(updated);
          this.saveStorage('jm_photos', updated);
        })
      );
    }
  }

  deletePhoto(id: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${environment.apiUrl}/photos/${id}`, { headers }).pipe(
      tap(() => {
        const updated = this.photos().filter(p => p.id !== id);
        this.photos.set(updated);
        this.saveStorage('jm_photos', updated);
        this.removeFromCart(id);
      })
    );
  }

  // --- CRUD SERVICIOS (CON PERSISTENCIA BACKEND) ---
  addService(newServiceData: Omit<ServiceItem, 'id'>, file?: File): Observable<ServiceItem> {
    const headers = this.getAuthHeaders();
    const payload = {
      ...newServiceData,
      whatsappUrl: newServiceData.whatsappUrl || this.defaultWhatsAppUrl
    };

    return this.http.post<ServiceItem>(`${environment.apiUrl}/services`, payload, { headers }).pipe(
      tap((saved) => {
        const serverService: ServiceItem = {
          ...saved,
          imageUrl: this.normalizeImageUrl(saved.imageUrl)
        };
        const updated = [...this.services().filter(s => s.id !== serverService.id), serverService];
        this.services.set(updated);
        this.saveStorage('jm_services', updated);
      })
    );
  }

  updateService(id: string, updatedData: Partial<ServiceItem>): Observable<ServiceItem> {
    const headers = this.getAuthHeaders();
    return this.http.put<ServiceItem>(`${environment.apiUrl}/services/${id}`, updatedData, { headers }).pipe(
      tap((saved) => {
        const serverService: ServiceItem = {
          ...saved,
          imageUrl: this.normalizeImageUrl(saved.imageUrl)
        };
        const updated = this.services().map(s => (s.id === id ? serverService : s));
        this.services.set(updated);
        this.saveStorage('jm_services', updated);
      })
    );
  }

  deleteService(id: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${environment.apiUrl}/services/${id}`, { headers }).pipe(
      tap(() => {
        const updated = this.services().filter(s => s.id !== id);
        this.services.set(updated);
        this.saveStorage('jm_services', updated);
      })
    );
  }

  // --- EDITAR PERFIL (CON PERSISTENCIA BACKEND Y MULTIPART) ---
  updateProfile(changes: Partial<ProfileData>, file?: File): Observable<ProfileData> {
    const headers = this.getAuthHeaders();

    // Actualización local inmediata para respuesta instantánea en UI
    const updatedLocal: ProfileData = {
      ...this.profile(),
      ...changes,
      tags: changes.tags !== undefined ? changes.tags : (this.profile().tags || [])
    };
    this.profile.set(updatedLocal);
    this.saveStorage('jm_profile', updatedLocal);

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      if (changes.name) formData.append('name', changes.name.trim());
      if (changes.title) formData.append('title', changes.title.trim());
      if (changes.location) formData.append('location', changes.location.trim());
      if (changes.bio) formData.append('bio', changes.bio.trim());
      if (changes.instagram) formData.append('instagram', changes.instagram.trim());
      if (changes.whatsapp) formData.append('whatsapp', changes.whatsapp.trim());
      if (changes.email) formData.append('email', changes.email.trim());
      if (changes.imageUrl) formData.append('imageUrl', changes.imageUrl.trim());
      if (changes.tags !== undefined) {
        formData.append('tags', JSON.stringify(changes.tags));
      }

      return this.http.put<ProfileData>(`${environment.apiUrl}/profile`, formData, { headers }).pipe(
        tap((saved) => {
          const updated: ProfileData = {
            ...updatedLocal,
            ...saved,
            tags: saved.tags !== undefined ? saved.tags : (changes.tags !== undefined ? changes.tags : updatedLocal.tags),
            imageUrl: this.normalizeImageUrl(saved.imageUrl)
          };
          this.profile.set(updated);
          this.saveStorage('jm_profile', updated);
        })
      );
    } else {
      const payload: Partial<ProfileData> = {
        ...updatedLocal,
        tags: changes.tags !== undefined ? changes.tags : updatedLocal.tags
      };
      return this.http.put<ProfileData>(`${environment.apiUrl}/profile`, payload, { headers }).pipe(
        tap((saved) => {
          const updated: ProfileData = {
            ...updatedLocal,
            ...saved,
            tags: saved.tags !== undefined ? saved.tags : (changes.tags !== undefined ? changes.tags : updatedLocal.tags),
            imageUrl: this.normalizeImageUrl(saved.imageUrl)
          };
          this.profile.set(updated);
          this.saveStorage('jm_profile', updated);
        })
      );
    }
  }

  // --- CART ACTIONS ---
  addToCart(photo: Photo): void {
    const currentCart = this.cart();
    const existingIndex = currentCart.findIndex(item => item.photo.id === photo.id);

    if (existingIndex > -1) {
      const updated = [...currentCart];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + 1
      };
      this.cart.set(updated);
    } else {
      this.cart.set([...currentCart, { photo, quantity: 1 }]);
    }
  }

  removeFromCart(photoId: string): void {
    this.cart.set(this.cart().filter(item => item.photo.id !== photoId));
  }

  updateQuantity(photoId: string, delta: number): void {
    const currentCart = this.cart();
    const itemIndex = currentCart.findIndex(item => item.photo.id === photoId);

    if (itemIndex === -1) return;

    const newQuantity = currentCart[itemIndex].quantity + delta;
    if (newQuantity <= 0) {
      this.removeFromCart(photoId);
    } else {
      const updated = [...currentCart];
      updated[itemIndex] = {
        ...updated[itemIndex],
        quantity: newQuantity
      };
      this.cart.set(updated);
    }
  }

  clearCart(): void {
    this.cart.set([]);
  }

  // --- MERCADO PAGO CHECKOUT PRO & ORDERS ---

  /**
   * Crea la orden de compra en Spring Boot (POST /api/orders) y genera inmediatamente
   * la preferencia de pago de Checkout Pro (POST /api/orders/{id}/preference).
   * Retorna la respuesta completa con preferenceId, initPoint, sandboxInitPoint y orderId.
   */
  initiateMercadoPagoCheckout(orderData: OrderRequest): Observable<CheckoutPreferenceResponse> {
    return this.http.post<OrderResult>(`${environment.apiUrl}/orders`, orderData).pipe(
      switchMap((order) => {
        return this.http.post<{ preferenceId: string; initPoint: string; sandboxInitPoint: string }>(
          `${environment.apiUrl}/orders/${order.id}/preference`, 
          {}
        ).pipe(
          map((pref) => ({
            preferenceId: pref.preferenceId,
            initPoint: pref.initPoint,
            sandboxInitPoint: pref.sandboxInitPoint,
            orderId: order.id
          }))
        );
      })
    );
  }

  /**
   * Genera o regenera la preferencia de pago de Mercado Pago para una orden ya existente.
   */
  createOrderPreference(orderId: string): Observable<CheckoutPreferenceResponse> {
    return this.http.post<{ preferenceId: string; initPoint: string; sandboxInitPoint: string }>(
      `${environment.apiUrl}/orders/${orderId}/preference`,
      {}
    ).pipe(
      map((pref) => ({
        preferenceId: pref.preferenceId,
        initPoint: pref.initPoint,
        sandboxInitPoint: pref.sandboxInitPoint,
        orderId
      }))
    );
  }

  /**
   * Consulta el estado de una orden en el backend (GET /api/orders/{id}).
   * Se utiliza al retornar desde Mercado Pago para validar la orden confirmada.
   */
  verifyOrderStatus(orderId: string): Observable<OrderResult> {
    return this.http.get<OrderResult>(`${environment.apiUrl}/orders/${orderId}`);
  }

  scrollToTop(smooth: boolean = true): void {
    this.viewportScroll.scrollToTop(smooth);
  }

  updateBodyScrollLock(): void {
    const isAnyOpen = this.isAdminDashboardOpen() || this.isCartOpen() || !!this.selectedPhoto();
    this.viewportScroll.setBodyScrollLocked(isAnyOpen);
  }

  toggleCart(): void {
    const willOpen = !this.isCartOpen();
    this.isCartOpen.set(willOpen);
    if (willOpen) {
      this.scrollToTop(true);
    }
    this.updateBodyScrollLock();
  }

  openCart(): void {
    this.isCartOpen.set(true);
    this.scrollToTop(true);
    this.updateBodyScrollLock();
  }

  closeCart(): void {
    this.isCartOpen.set(false);
    this.updateBodyScrollLock();
  }

  openPreview(photo: Photo): void {
    this.selectedPhoto.set(photo);
    this.scrollToTop(true);
    this.updateBodyScrollLock();
  }

  closePreview(): void {
    this.selectedPhoto.set(null);
    this.updateBodyScrollLock();
  }

  // --- ALBUM CRUD ACTIONS (CON PERSISTENCIA BACKEND) ---
  addAlbum(data: { name: string; description: string; coverImage?: string; displayOrder?: number }, file?: File): Observable<AlbumFolder> {
    const headers = this.getAuthHeaders();

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', data.name.trim());
      formData.append('description', (data.description || '').trim());
      if (data.coverImage) formData.append('coverImage', data.coverImage.trim());
      if (data.displayOrder !== undefined) formData.append('displayOrder', String(data.displayOrder));

      return this.http.post<AlbumFolder>(`${environment.apiUrl}/albums`, formData, { headers }).pipe(
        tap((saved) => {
          const serverAlbum: AlbumFolder = {
            ...saved,
            coverImage: this.normalizeImageUrl(saved.coverImage)
          };
          this.albums.update(list => [...list, serverAlbum]);
          this.saveStorage('jm_custom_albums', this.albums());
          this.showAlert('success', `Álbum "${serverAlbum.name}" creado con éxito.`);
        })
      );
    } else {
      const payload = {
        name: data.name.trim(),
        description: (data.description || '').trim(),
        coverImage: data.coverImage || '',
        displayOrder: data.displayOrder || 0
      };

      return this.http.post<AlbumFolder>(`${environment.apiUrl}/albums`, payload, { headers }).pipe(
        tap((saved) => {
          const serverAlbum: AlbumFolder = {
            ...saved,
            coverImage: this.normalizeImageUrl(saved.coverImage)
          };
          this.albums.update(list => [...list, serverAlbum]);
          this.saveStorage('jm_custom_albums', this.albums());
          this.showAlert('success', `Álbum "${serverAlbum.name}" creado con éxito.`);
        })
      );
    }
  }

  updateAlbum(id: string, updates: Partial<AlbumFolder>, previousName?: string, file?: File): Observable<AlbumFolder> {
    const headers = this.getAuthHeaders();
    const oldName = previousName || this.albums().find(a => a.id === id)?.name;
    const newName = updates.name ? updates.name.trim() : undefined;

    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      if (updates.name) formData.append('name', updates.name.trim());
      if (updates.description !== undefined) formData.append('description', (updates.description || '').trim());
      if (updates.coverImage) formData.append('coverImage', updates.coverImage.trim());
      if (updates.displayOrder !== undefined) formData.append('displayOrder', String(updates.displayOrder));

      return this.http.put<AlbumFolder>(`${environment.apiUrl}/albums/${id}`, formData, { headers }).pipe(
        tap((saved) => {
          const serverAlbum: AlbumFolder = {
            ...saved,
            coverImage: this.normalizeImageUrl(saved.coverImage)
          };
          this.albums.update(list => list.map(a => (a.id === id ? serverAlbum : a)));

          // Si cambió el nombre del álbum, sincronizar fotos en memoria
          if (newName && oldName && oldName !== newName) {
            this.photos.update(list =>
              list.map(p => (p.category === oldName ? { ...p, category: newName } : p))
            );
            this.saveStorage('jm_photos', this.photos());
          }

          this.saveStorage('jm_custom_albums', this.albums());
          this.showAlert('success', `Álbum "${serverAlbum.name}" actualizado correctamente.`);
        })
      );
    } else {
      return this.http.put<AlbumFolder>(`${environment.apiUrl}/albums/${id}`, updates, { headers }).pipe(
        tap((saved) => {
          const serverAlbum: AlbumFolder = {
            ...saved,
            coverImage: this.normalizeImageUrl(saved.coverImage)
          };
          this.albums.update(list => list.map(a => (a.id === id ? serverAlbum : a)));

          if (newName && oldName && oldName !== newName) {
            this.photos.update(list =>
              list.map(p => (p.category === oldName ? { ...p, category: newName } : p))
            );
            this.saveStorage('jm_photos', this.photos());
          }

          this.saveStorage('jm_custom_albums', this.albums());
          this.showAlert('success', `Álbum "${serverAlbum.name}" actualizado correctamente.`);
        })
      );
    }
  }

  deleteAlbum(id: string): Observable<void> {
    const headers = this.getAuthHeaders();
    const albumToDelete = this.albums().find(a => a.id === id);

    return this.http.delete<void>(`${environment.apiUrl}/albums/${id}`, { headers }).pipe(
      tap(() => {
        this.albums.update(list => list.filter(a => a.id !== id));
        this.saveStorage('jm_custom_albums', this.albums());
        this.showAlert('success', `Álbum "${albumToDelete?.name || ''}" eliminado.`);
      })
    );
  }

  startEditingAlbum(album: AlbumFolder): void {
    this.editingAlbum.set(album);
    this.openAdminDashboard('albums');
  }

  // --- ADMIN DASHBOARD ACTIONS ---
  toggleAdminDashboard(tab: 'photos' | 'albums' | 'services' | 'profile' = 'photos'): void {
    if (!this.isAdminDashboardOpen()) {
      this.openAdminDashboard(tab);
      return;
    }
    // Si ya está abierto pero en OTRA pestaña, cambia a la pestaña deseada sin cerrar
    if (this.adminInitialTab() !== tab) {
      this.openAdminDashboard(tab);
      return;
    }
    this.closeAdminDashboard();
  }

  openAdminDashboard(tab: 'photos' | 'albums' | 'services' | 'profile' = 'photos'): void {
    this.adminInitialTab.set(tab);
    this.isAdminDashboardOpen.set(true);
    this.scrollToTop(true);
    this.updateBodyScrollLock();
    const targetRoute = tab === 'photos' ? 'crud' : tab;
    if (typeof window !== 'undefined' && this.router.url !== `/admin/${targetRoute}`) {
      this.router.navigate(['/admin', targetRoute]);
    }
  }

  closeAdminDashboard(): void {
    this.isAdminDashboardOpen.set(false);
    this.editingPhoto.set(null);
    this.editingAlbum.set(null);
    this.editingService.set(null);
    this.updateBodyScrollLock();
    if (typeof window !== 'undefined' && this.router.url.startsWith('/admin')) {
      this.router.navigate(['/']);
    }
  }
}
