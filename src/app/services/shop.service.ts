import { Injectable, signal, computed } from '@angular/core';
import { Photo, PhotoCategory, CartItem } from '../models/photo.model';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  // Initial curated photography catalog
  private readonly initialPhotos: Photo[] = [
    {
      id: 'photo-1',
      title: 'Crepúsculo en las Dolomitas',
      category: 'Paisaje',
      price: 145,
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
      description: 'Luz crepuscular cayendo sobre las cumbres afiladas de los Alpes italianos. Una atmósfera etérea teñida de púrpuras y violetas profundos.',
      dimensions: '75 x 50 cm · Fine Art Hahnemühle',
      cameraDetails: {
        camera: 'Sony Alpha 7R V',
        lens: 'FE 16-35mm f/2.8 GM II',
        aperture: 'f/8.0',
        shutter: '1/4s',
        iso: 'ISO 100'
      },
      inStock: true,
      badge: 'Edición Limitada',
      featured: true
    },
    {
      id: 'photo-2',
      title: 'Esencia de Lavanda & Cuarzo',
      category: 'Producto',
      price: 95,
      imageUrl: 'https://images.unsplash.com/photo-1608248597359-28c049e048ea?auto=format&fit=crop&w=1200&q=85',
      description: 'Fotografía comercial editorial de perfume artesanal botánico con iluminación de estudio violeta degradada y reflejos prismáticos.',
      dimensions: '50 x 50 cm · Impresión Giclée',
      cameraDetails: {
        camera: 'Fujifilm GFX 100S',
        lens: 'GF 120mm f/4 Macro',
        aperture: 'f/11',
        shutter: '1/160s',
        iso: 'ISO 64'
      },
      inStock: true,
      badge: 'Bestseller'
    },
    {
      id: 'photo-3',
      title: 'Aurora Boreal en Tromsø',
      category: 'Paisaje',
      price: 180,
      imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=85',
      description: 'Velo magnético de aurora danzando en tonos magentas y violetas sobre los fiordos árticos noruegos.',
      dimensions: '90 x 60 cm · Aluminio Dibond',
      cameraDetails: {
        camera: 'Canon EOS R5',
        lens: 'RF 15-35mm f/2.8L IS USM',
        aperture: 'f/2.8',
        shutter: '6.0s',
        iso: 'ISO 1600'
      },
      inStock: true,
      badge: 'Destacada'
    },
    {
      id: 'photo-4',
      title: 'Cronógrafo Automático Obsidian',
      category: 'Producto',
      price: 120,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
      description: 'Detalle de alta relojería suiza. Macrofotografía con destellos violetas y texturas de titanio cepillado.',
      dimensions: '40 x 40 cm · Papel Baritado 310g',
      cameraDetails: {
        camera: 'Hasselblad X2D 100C',
        lens: 'XCD 120mm f/3.5 Macro',
        aperture: 'f/16',
        shutter: '1/125s',
        iso: 'ISO 100'
      },
      inStock: true
    },
    {
      id: 'photo-5',
      title: 'Niebla Mística en el Lago Moraine',
      category: 'Paisaje',
      price: 160,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
      description: 'Calma absoluta en las aguas turquesas del parque nacional Banff envueltas en bruma crepuscular púrpura.',
      dimensions: '80 x 50 cm · Papel Museo Rag',
      cameraDetails: {
        camera: 'Nikon Z8',
        lens: 'NIKKOR Z 24-70mm f/2.8 S',
        aperture: 'f/8.0',
        shutter: '1/8s',
        iso: 'ISO 64'
      },
      inStock: true,
      badge: 'Popular'
    },
    {
      id: 'photo-6',
      title: 'Vaso Cerámico Minimalista & Sombra',
      category: 'Producto',
      price: 85,
      imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=85',
      description: 'Estética nórdica en gres esmaltado con iluminación lateral y siluetas sutiles en paleta violeta desaturada.',
      dimensions: '45 x 60 cm · Fine Art Mate',
      cameraDetails: {
        camera: 'Sony Alpha 7R V',
        lens: 'FE 50mm f/1.2 GM',
        aperture: 'f/4.0',
        shutter: '1/200s',
        iso: 'ISO 100'
      },
      inStock: true
    },
    {
      id: 'photo-7',
      title: 'Campos de Lavanda en Valensole',
      category: 'Paisaje',
      price: 135,
      imageUrl: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?auto=format&fit=crop&w=1200&q=85',
      description: 'Geometría perfecta y líneas infinitas de floración en Provenza bajo la luz dorada y violeta del atardecer.',
      dimensions: '75 x 50 cm · Lienzo Fine Art Montado',
      cameraDetails: {
        camera: 'Leica SL2',
        lens: 'Vario-Elmarit-SL 24-90mm',
        aperture: 'f/5.6',
        shutter: '1/60s',
        iso: 'ISO 100'
      },
      inStock: true,
      badge: 'Nuevo'
    },
    {
      id: 'photo-8',
      title: 'Gafas de Diseño Aviador Prisma',
      category: 'Producto',
      price: 110,
      imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=85',
      description: 'Gafas de sol de armazón metálico con reflejos violetas y degradados de cian en lentes polarizados.',
      dimensions: '40 x 40 cm · Impresión Metálica',
      cameraDetails: {
        camera: 'Canon EOS R5',
        lens: 'RF 100mm f/2.8L Macro',
        aperture: 'f/14',
        shutter: '1/200s',
        iso: 'ISO 100'
      },
      inStock: true
    },
    {
      id: 'photo-9',
      title: 'Acantilados Negros de Reynisfjara',
      category: 'Paisaje',
      price: 175,
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=85',
      description: 'El poder del Atlántico Norte golpeando las columnas de basalto de Islandia bajo un cielo tormentoso color berenjena.',
      dimensions: '90 x 60 cm · Aluminio Mate',
      cameraDetails: {
        camera: 'Sony Alpha 1',
        lens: 'FE 24-70mm f/2.8 GM II',
        aperture: 'f/9.0',
        shutter: '0.8s',
        iso: 'ISO 80'
      },
      inStock: true,
      badge: 'Exclusivo'
    }
  ];

  // Signals State
  readonly photos = signal<Photo[]>(this.initialPhotos);
  readonly selectedCategory = signal<PhotoCategory | 'Todos'>('Todos');
  readonly cart = signal<CartItem[]>([]);
  readonly isCartOpen = signal<boolean>(false);
  readonly selectedPhoto = signal<Photo | null>(null);
  readonly isUploadModalOpen = signal<boolean>(false);
  readonly searchQuery = signal<string>('');

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

  // Actions
  setCategory(category: PhotoCategory | 'Todos'): void {
    this.selectedCategory.set(category);
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

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

  openUploadModal(): void {
    this.isUploadModalOpen.set(true);
  }

  closeUploadModal(): void {
    this.isUploadModalOpen.set(false);
  }

  addPhoto(newPhotoData: Omit<Photo, 'id'>): void {
    const newPhoto: Photo = {
      ...newPhotoData,
      id: 'photo-' + Date.now()
    };
    // Prepend so new photo shows up immediately at the top of the gallery
    this.photos.update(photos => [newPhoto, ...photos]);
  }
}
