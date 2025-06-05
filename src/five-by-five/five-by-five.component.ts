import { Component } from '@angular/core';
import { NumByNumComponent } from "../num-by-num/num-by-num.component";

@Component({
  selector: 'app-five-by-five',
  imports: [NumByNumComponent],
  template:'<app-num-by-num [num_columns]="5" [num_rows]="5" [step_count]="step_count"/>'
})
export class FiveByFiveComponent {
  step_count = 3
}
