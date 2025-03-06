import { Component } from '@angular/core';
import { NavbarAdminComponent } from '../navbar-admin/navbar-admin.component';


@Component({
  selector: 'app-cursos-admin',
  standalone: true,
  imports: [NavbarAdminComponent],
  templateUrl: './cursos-admin.component.html',
  styleUrl: './cursos-admin.component.css'
})
export class CursosAdminComponent {

}
