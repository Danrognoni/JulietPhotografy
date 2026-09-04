import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { UploadPanelComponent } from './components/upload-panel/upload-panel.component';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';
import { PhotoModalComponent } from './components/photo-modal/photo-modal.component';
import { FooterComponent } from './components/footer/footer.component';
import { ShopService } from './services/shop.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    GalleryComponent,
    UploadPanelComponent,
    CartDrawerComponent,
    PhotoModalComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly shop = inject(ShopService);
}
