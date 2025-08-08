import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Component, forwardRef, Input } from '@angular/core';

type InputTypes = 'text' | 'email' | 'password';

@Component({
  selector: 'app-primary-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PrimaryInputComponent),
      multi: true
    }
  ],
  templateUrl: './primary-input.component.html',
  styleUrl: './primary-input.component.scss'
})
export class PrimaryInputComponent implements ControlValueAccessor { 
  @Input() type: InputTypes = 'text';
  @Input() formName: string = "";
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() inputName: string = '';

  value: string = '';
  isFocused: boolean = false;
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get isActive(): boolean {
    return this.isFocused || (this.value !== null && this.value !== undefined && this.value.toString().length > 0);
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }

  writeValue(value: any): void {
      this.value = value;
  }

  registerOnChange(fn: any): void {      
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handle the disabled state if needed
  }
}
