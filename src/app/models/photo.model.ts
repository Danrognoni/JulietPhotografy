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
}
