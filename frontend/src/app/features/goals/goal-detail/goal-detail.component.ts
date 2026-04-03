import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InputNumberComponent } from '../../../shared/components/atoms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GoalService } from '../../../core/services/goal.service';
import { Goal, GoalStatus, SubGoal } from '../../../core/models/goal.model';
import { GoalFormDialogComponent } from '../goal-form/goal-form-dialog.component';

@Component({
  selector: 'll-goal-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, DatePipe,
            MatIconModule, MatButtonModule, MatDialogModule,
            InputNumberComponent],
  templateUrl: './goal-detail.component.html',
  styleUrl: './goal-detail.component.scss'
})
export class GoalDetailComponent implements OnInit {
  goal    = signal<Goal | null>(null);
  loading = signal(true);

  progressForm = this.fb.group({
    currentValue: [0, [Validators.required, Validators.min(0)]]
  });

  statuses: GoalStatus[] = ['IN_PROGRESS', 'COMPLETED', 'DELAYED', 'CANCELLED'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private goalService: GoalService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.goalService.findById(id).subscribe({
      next: g => {
        this.goal.set(g);
        this.progressForm.patchValue({ currentValue: g.currentValue });
        this.loading.set(false);
      },
      error: () => this.router.navigate(['/goals'])
    });
  }

  updateProgress() {
    if (this.progressForm.invalid || !this.goal()) return;
    this.goalService.updateProgress(this.goal()!.id, this.progressForm.value as any)
      .subscribe(g => this.goal.set(g));
  }

  updateStatus(status: GoalStatus) {
    if (!this.goal()) return;
    this.goalService.updateStatus(this.goal()!.id, status)
      .subscribe(g => this.goal.set(g));
  }

  openEdit() {
    const ref = this.dialog.open(GoalFormDialogComponent, {
      width: '520px',
      maxWidth: 'calc(100vw - 24px)',
      disableClose: false,
      panelClass: 'modal-dialog',
      data: { goal: this.goal() }
    });
    ref.afterClosed().subscribe(ok => {
      if (ok) this.goalService.findById(this.goal()!.id).subscribe(g => this.goal.set(g));
    });
  }

  statusLabel(s: string) {
    return { IN_PROGRESS: 'Em andamento', COMPLETED: 'Concluída', DELAYED: 'Atrasada', CANCELLED: 'Cancelada' }[s] ?? s;
  }

  statusClass(s: string) {
    return 'badge-' + (({
      IN_PROGRESS: 'indigo',
      COMPLETED:   'emerald',
      DELAYED:     'rose',
      CANCELLED:   'muted'
    } as any)[s] ?? 'muted');
  }
}
