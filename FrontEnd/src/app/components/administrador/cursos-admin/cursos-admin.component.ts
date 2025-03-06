import { Component } from '@angular/core';
import { NavbarAdminComponent } from '../navbar-admin/navbar-admin.component';
import { FooterComponent } from '../footer/footer.component';


@Component({
  selector: 'app-cursos-admin',
  standalone: true,
  imports: [NavbarAdminComponent, FooterComponent],
  templateUrl: './cursos-admin.component.html',
  styleUrl: './cursos-admin.component.css'
})
export class CursosAdminComponent {

}
