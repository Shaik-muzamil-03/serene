import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-primary-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './primary-button.component.html'
})
export class PrimaryButtonComponent {
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @Output() click = new EventEmitter<MouseEvent>();

  get classes(): string {
    const base: string = 'inline-flex items-center font-semibold text-xs uppercase tracking-widest transition ease-in-out duration-150 focus:outline-none focus:ring rounded border border-transparent';

    const sizeMap = {
      sm: 'px-2 py-2 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    const variantMap = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer',
      secondary: 'text-blue-600 bg-blue-200 hover:bg-blue-300 cursor-pointer',
      danger: 'bg-red-600 text-white hover:bg-red-500 cursor-pointer',
    };

    const variantDisabledMap = {
      primary: 'bg-blue-500 text-white cursor-not-allowed',
      secondary: 'bg-blue-300 text-blue-700 cursor-not-allowed',
      danger: 'bg-red-500 text-white cursor-not-allowed',
    };

    return `${base} ${sizeMap[this.size]} ${this.disabled
        ? variantDisabledMap[this.variant]
        : variantMap[this.variant]
      }`;
  }

  handleClick(event: MouseEvent) {
    if (this.type !== 'submit') {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!this.disabled && !this.isLoading) {
      this.click.emit(event);
    }
  }
}
