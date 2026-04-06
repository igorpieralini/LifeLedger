import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AtomAlert } from './components/atoms/atom-alert/atom-alert';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AtomAlert],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}
