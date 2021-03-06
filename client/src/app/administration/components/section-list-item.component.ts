import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Section } from '@esn/client/core/models';
import { GlobalPermissions } from '@esn/shared/global-permissions';

@Component({
  selector: 'esn-section-list-item',
  template: `
    <h4>{{ section.name }}</h4>
    <button
      mat-stroked-button
      color="warn"
      (click)="delete.emit(section.id)"
      *esnWithPermission="deletePermission"
    >
      Delete Section
    </button>
    <a mat-stroked-button routerLink="{{ section.id }}">View details</a>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionListItemComponent {
  @Input() section: Section;
  @Output() delete = new EventEmitter<string>();
  deletePermission = GlobalPermissions.ADMIN;
  constructor() {}
}
