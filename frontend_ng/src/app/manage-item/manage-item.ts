import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDataList, TuiError, TuiGroup, TuiIcon, TuiLabel, TuiSelectLike, TuiTextfield, TuiTitle, TuiDropdownOptionsDirective } from '@taiga-ui/core';
import {
  TuiBlock,
  TuiCheckbox,
  TuiChevron,
  TuiDataListWrapper,
  TuiFieldErrorPipe,
  TuiFilterByInputPipe,
  TuiHideSelectedPipe,
  TuiInputChip,
  TuiInputDate,
  TuiInputNumber,
  TuiInputPhone,
  TuiInputSlider,
  TuiInputTime,
  TuiMultiSelect,
  TuiPassword,
  TuiRadio,
  TuiSelect,
  TuiTextarea,
  TuiTooltip,
} from '@taiga-ui/kit';
import { TuiCurrency, TuiCurrencyPipe } from '@taiga-ui/addon-commerce';
import { TuiForm, TuiHeader } from '@taiga-ui/layout';
import { of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-manage-item',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    TuiBlock,
    TuiButton,
    TuiCheckbox,
    TuiChevron,
    TuiCurrencyPipe,
    TuiDataListWrapper,
    TuiDataList,
    TuiFilterByInputPipe,
    TuiHideSelectedPipe,
    TuiInputChip,
    TuiMultiSelect,
    TuiSelectLike,
    TuiError,
    TuiFieldErrorPipe,
    TuiForm,
    TuiGroup,
    TuiHeader,
    TuiIcon,
    TuiInputDate,
    TuiInputNumber,
    TuiInputPhone,
    TuiInputSlider,
    TuiInputTime,
    TuiLabel,
    TuiPassword,
    TuiRadio,
    TuiSelect,
    TuiTextfield,
    TuiTextarea,
    TuiTitle,
    TuiTooltip,
    TuiDropdownOptionsDirective
],
  templateUrl: './manage-item.html',
  styleUrl: './manage-item.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageItem {
  itemForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(255)],
    }),
    description: new FormControl(''),
    amount: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    tags: new FormControl<string[]>([], {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
  });

  titleError = toSignal(
    this.itemForm.controls.title.valueChanges.pipe(
      switchMap((username) => {
        if (!this.itemForm.controls.title.dirty && !this.itemForm.controls.title.touched) {
          return of(null);
        }

        if (username.length == 0) {
          return of('Enter a username');
        }

        if (username.length < 3) {
          return of('Username should be at least 3 characters long');
        }

        if (username.length > 255) {
          return of('Username should not exceed 255 characters');
        }

        return of(null);
      }),
    ),
    {
      initialValue: null,
    },
  );

  protected arbitrary: string[] = [];
  protected readonly items: string[] = [
    // Add some meaningful tags
    'tag1',
    'tag2',
    'tag3',
    'tag4',
    'tag5',
    'tag6',
    'tag7',
    'tag8',
    'tag9',
    'tag10',
  ];
}
