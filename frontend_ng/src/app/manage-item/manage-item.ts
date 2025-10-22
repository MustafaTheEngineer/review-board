import { AsyncPipe } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  TuiButton,
  TuiDataList,
  TuiError,
  TuiGroup,
  TuiIcon,
  TuiLabel,
  TuiSelectLike,
  TuiTextfield,
  TuiTitle,
  TuiDropdownOptionsDirective,
} from '@taiga-ui/core';
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
import { BehaviorSubject, catchError, combineLatest, map, of, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Tag, TagsGQL } from '../../graphql/generated';
import { error } from 'console';

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
    TuiDropdownOptionsDirective,
  ],
  templateUrl: './manage-item.html',
  styleUrl: './manage-item.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageItem {
  tagsGQL = inject(TagsGQL);

  constructor() {
    afterNextRender(() => {
      this.tagsGQL
        .fetch({
          fetchPolicy: 'network-only',
        })
        .pipe(
          catchError((error) => {
            this.tagserverError$.next(error.message);
            return of(new Error(error.message));
          }),
        )
        .subscribe((result) => {
          if (!(result instanceof Error)) {
            if (result.data?.tags) {
              this.tags.set(result.data.tags);
            }
          }
        });
    });
  }

  itemForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(255)],
    }),
    description: new FormControl(''),
    amount: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    tags: new FormControl<string[]>([], {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), forbiddenNameValidator()],
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
  amountError = toSignal(
    this.itemForm.controls.amount.valueChanges.pipe(
      switchMap((amount) => {
        if (!this.itemForm.controls.amount.dirty && !this.itemForm.controls.amount.touched) {
          return of(null);
        }

        if (amount < 0) {
          return of('Amount should be greater than or equal to 0');
        }

        return of(null);
      }),
    ),
    {
      initialValue: null,
    },
  );

  private tagserverError$ = new BehaviorSubject<null | string>(null);
  tagsError = toSignal(
    combineLatest(
      [this.itemForm.controls.tags.valueChanges, this.tagserverError$],
      (formTags, error) => ({ formTags, error }),
    ).pipe(
      map(({ formTags, error }) => {
        if (formTags.length < 3) {
          return 'You should add at least 3 tags';
        }

        if (this.itemForm.controls.tags.hasError('whitespace')) {
          return 'Tags should not contain whitespace';
        }
        if (this.itemForm.controls.tags.hasError('tagMinLength')) {
          return 'Tags should have at least 3 characters';
        }
        if (this.itemForm.controls.tags.hasError('tagMaxLength')) {
          return 'Tags should not exceed 255 characters';
        }
        return error;
      }),
    ),
    {
      initialValue: null,
    },
  );

  onTagInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.tagsGQL
      .fetch({
        fetchPolicy: 'network-only',
        variables: {
          query: {
            like: value,
          },
        },
      })
      .pipe(
        catchError((error) => {
          this.tagserverError$.next(error.message);
          return of(new Error(error.message));
        }),
      )
      .subscribe((result) => {
        if (!(result instanceof Error)) {
          if (result.data?.tags) {
            this.tags.set(result.data.tags);
          }
        }
      });
  }

  tags = signal<Tag[]>([]);
  tagStrings = computed(() => {
    const tags = this.tags();

    return tags.map((tag) => tag.name);
  });

  onSubmit() {}
}

export function forbiddenNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!Array.isArray(control.value)) {
      return null;
    }
    for (const tag of control.value) {
      if (tag.length < 3) {
        return { tagMinLength: { value: tag } };
      } else if (tag.length > 255) {
        return { tagMaxLength: { value: tag } };
      } else if (tag.includes(' ')) {
        return { whitespace: { value: tag } };
      }
    }

    return null;
  };
}
