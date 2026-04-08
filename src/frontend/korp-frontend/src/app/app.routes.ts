import { Routes } from '@angular/router';
import { NotasPageComponent } from './Pages/notas/notas-page.component';
import { ProdutosPageComponent } from './Pages/produtos/produtos-page.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'produtos' },
	{ path: 'produtos', component: ProdutosPageComponent },
	{ path: 'notas', component: NotasPageComponent }
];
