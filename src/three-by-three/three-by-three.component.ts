import { Component } from '@angular/core';
import { NumByNumComponent } from '../num-by-num/num-by-num.component';

@Component({
  selector: 'app-three-by-three',
  imports: [NumByNumComponent],
  template: '<app-num-by-num [num_columns]="3" [num_rows]="3" [step_count]="step_count"/>',
})

export class ThreeByThreeComponent{
  step_count = 3
}
