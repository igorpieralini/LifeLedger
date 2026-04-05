import { Component } from '@angular/core';
import { SharedMaster } from '../components/shared/shared-master/shared-master';

@Component({
  selector: 'view-main',
  imports: [SharedMaster],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class MainView {}
