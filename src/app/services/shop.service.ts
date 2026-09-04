import { Injectable, signal, computed, inject } from '@angular/core';
import { Photo, PhotoCategory, ServiceItem, ProfileData, CartItem } from '../models/photo.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  readonly auth = inject(AuthService);

  readonly defaultWhatsAppUrl = 'https://wa.me/5492281311917?text=Hola%20Julieta,%20vengo%20de%20tu%20sitio%20web%20y%20me%20gustar%C3%ADa%20agendar%20una%20cita.';
  readonly defaultInstagramUrl = 'https://www.instagram.com/julietamph_/';
  readonly defaultInstagramHandle = '@julietamph_';

  // Initial curated photography catalog
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
    instagram: '@julietamph_'
  };

  // State Signals with localStorage initializers
  readonly photos = signal<Photo[]>(this.loadStorage('jm_photos', this.defaultPhotos));
  readonly services = signal<ServiceItem[]>(this.loadStorage('jm_services', this.defaultServices));
  readonly profile = signal<ProfileData>(this.loadStorage('jm_profile', this.defaultProfile));

  readonly selectedCategory = signal<PhotoCategory | 'Todos'>('Todos');
  readonly searchQuery = signal<string>('');
  
  readonly cart = signal<CartItem[]>([]);
  readonly isCartOpen = signal<boolean>(false);
  readonly selectedPhoto = signal<Photo | null>(null);
  readonly isAdminDashboardOpen = signal<boolean>(false);
  readonly adminInitialTab = signal<'photos' | 'services' | 'profile'>('photos');

  // Computed state
  readonly filteredPhotos = computed(() => {
    const category = this.selectedCategory();
    const query = this.searchQuery().toLowerCase().trim();
    const all = this.photos();

    return all.filter(photo => {
      const matchesCategory = category === 'Todos' || photo.category === category;
      const matchesSearch = query === '' ||
        photo.title.toLowerCase().includes(query) ||
        photo.description.toLowerCase().includes(query) ||
        photo.technicalSheet.toLowerCase().includes(query) ||
        photo.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  });

  readonly cartCount = computed(() => {
    return this.cart().reduce((total, item) => total + item.quantity, 0);
  });

  readonly cartTotal = computed(() => {
    return this.cart().reduce((total, item) => total + (item.photo.price * item.quantity), 0);
  });

  private loadStorage<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
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

  // --- CRUD FOTOS (ID ÚNICO & PERSISTENCIA) ---
  addPhoto(newPhotoData: Omit<Photo, 'id'>): void {
    const newPhoto: Photo = {
      ...newPhotoData,
      id: 'photo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5)
    };
    const updated = [newPhoto, ...this.photos()];
    this.photos.set(updated);
    this.saveStorage('jm_photos', updated);
  }

  updatePhoto(id: string, updatedData: Partial<Photo>): void {
    const updated = this.photos().map(p => (p.id === id ? { ...p, ...updatedData } : p));
    this.photos.set(updated);
    this.saveStorage('jm_photos', updated);
  }

  deletePhoto(id: string): void {
    const updated = this.photos().filter(p => p.id !== id);
    this.photos.set(updated);
    this.saveStorage('jm_photos', updated);
    this.removeFromCart(id);
  }

  // --- CRUD SERVICIOS (ID ÚNICO & PERSISTENCIA) ---
  addService(newServiceData: Omit<ServiceItem, 'id'>): void {
    const newService: ServiceItem = {
      ...newServiceData,
      id: 'serv-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      whatsappUrl: newServiceData.whatsappUrl || this.defaultWhatsAppUrl
    };
    const updated = [...this.services(), newService];
    this.services.set(updated);
    this.saveStorage('jm_services', updated);
  }

  updateService(id: string, updatedData: Partial<ServiceItem>): void {
    const updated = this.services().map(s => (s.id === id ? { ...s, ...updatedData } : s));
    this.services.set(updated);
    this.saveStorage('jm_services', updated);
  }

  deleteService(id: string): void {
    const updated = this.services().filter(s => s.id !== id);
    this.services.set(updated);
    this.saveStorage('jm_services', updated);
  }

  // --- EDITAR PERFIL (PERSISTENCIA) ---
  updateProfile(changes: Partial<ProfileData>): void {
    const updated = { ...this.profile(), ...changes };
    this.profile.set(updated);
    this.saveStorage('jm_profile', updated);
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

  toggleCart(): void {
    this.isCartOpen.update(v => !v);
  }

  openCart(): void {
    this.isCartOpen.set(true);
  }

  closeCart(): void {
    this.isCartOpen.set(false);
  }

  openPreview(photo: Photo): void {
    this.selectedPhoto.set(photo);
  }

  closePreview(): void {
    this.selectedPhoto.set(null);
  }

  // --- ADMIN DASHBOARD ACTIONS ---
  toggleAdminDashboard(tab: 'photos' | 'services' | 'profile' = 'photos'): void {
    this.adminInitialTab.set(tab);
    this.isAdminDashboardOpen.update(v => !v);
  }

  openAdminDashboard(tab: 'photos' | 'services' | 'profile' = 'photos'): void {
    this.adminInitialTab.set(tab);
    this.isAdminDashboardOpen.set(true);
  }

  closeAdminDashboard(): void {
    this.isAdminDashboardOpen.set(false);
  }
}
