import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { SidebarComponent, HeaderComponent, FooterComponent } from '../features';

@Component({
  selector: 'll-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, FooterComponent, NgIf],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  /** Tracks whether the sidebar is in collapsed state. Initialises based on viewport. */
  collapsed = window.innerWidth <= 768;

  @ViewChild(SidebarComponent) private sidebar!: SidebarComponent;

  onCollapsedChange(collapsed: boolean): void {
    this.collapsed = collapsed;
  }

  /** Close the sidebar on mobile when the backdrop is tapped. */
  closeNav(): void {
    if (!this.collapsed && this.sidebar) {
      this.sidebar.toggle();
    }
  }
}
