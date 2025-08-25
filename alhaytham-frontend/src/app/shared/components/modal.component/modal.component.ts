import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  @Input() show = false;
  @Output() onClose = new EventEmitter<void>();

  close() {
    this.onClose.emit();
  }
}
