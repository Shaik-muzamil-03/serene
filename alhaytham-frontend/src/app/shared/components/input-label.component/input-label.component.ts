import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-label',
  standalone: true,
  imports: [],
  templateUrl: './input-label.component.html'
})
export class InputLabelComponent {
  @Input() for: string = '';
  @Input() text: string = 'Label';
}
