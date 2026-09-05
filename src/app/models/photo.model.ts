export type PhotoCategory = 'Foto Producto' | 'Paisajismo' | 'Eventos' | 'Casamientos' | 'Cumpleaños XV' | (string & {});

export interface CameraSpecs {
  camera: string;
  lens: string;
  aperture: string;
  shutter: string;
  iso: string;
}

export interface Photo {
  id: string;
  title: string;
  category: PhotoCategory;
  price: number;
  imageUrl: string;
  description: string;
  dimensions: string;
  technicalSheet: string; // Mandatory technical sheet (camera, lens, settings)
  cameraDetails?: CameraSpecs;
  inStock: boolean;
  badge?: string;
  featured?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  features: string[];
  whatsappUrl: string;
}

export interface ProfileData {
  name: string;
  title: string;
  location: string;
  imageUrl: string;
  bio: string;
  whatsapp: string;
  email: string;
  instagram: string;
  tags?: string[];
}

export interface CartItem {
  photo: Photo;
  quantity: number;
}

export interface AlbumFolder {
  id: string;
  name: string;
  category: string;
  coverImage: string;
  count: number;
  description: string;
  displayOrder?: number;
  photoUrls?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CoverPhoto {
  photoId?: string;
  imageUrl: string;
  title?: string;
  category?: string;
  description?: string;
  updatedAt?: string;
}

// Mercado Pago & Order Interfaces
export interface CheckoutPreferenceResponse {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
  orderId: string;
}

export interface OrderItemRequest {
  photoId: string;
  quantity: number;
}

export interface OrderRequest {
  customerName: string;
  customerContact: string;
  notes?: string;
  items: OrderItemRequest[];
}

export interface OrderItemResult {
  id?: number;
  photoId: string;
  photoTitle: string;
  photoCategory?: string;
  photoImageUrl?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface OrderResult {
  id: string;
  customerName: string;
  customerContact: string;
  notes?: string;
  status: OrderStatus;
  subtotal: number;
  total: number;
  totalItems: number;
  items: OrderItemResult[];
  createdAt: string;
  preferenceId?: string;
  initPoint?: string;
  sandboxInitPoint?: string;
}

export type Order = OrderResult;

