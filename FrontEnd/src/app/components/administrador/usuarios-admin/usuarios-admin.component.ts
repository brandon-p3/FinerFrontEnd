import { Component } from '@angular/core';
import { NavbarAdminComponent } from '../navbar-admin/navbar-admin.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [NavbarAdminComponent, FooterComponent],
  templateUrl: './usuarios-admin.component.html',
  styleUrl: './usuarios-admin.component.css'
})
export class UsuariosAdminComponent {

}
