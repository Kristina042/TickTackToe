import { Component } from '@angular/core';
import { NumByNumComponent } from '../num-by-num/num-by-num.component';

// @Component({
//   selector: 'app-ten-by-ten',
//   imports: [NumByNumComponent],
//   templateUrl: './ten-by-ten.component.html',
//   styleUrl: './ten-by-ten.component.scss'
// })

@Component({
  selector: 'app-ten-by-ten',
  imports: [NumByNumComponent],
  template: '<app-num-by-num [num_columns]="10" [num_rows]="10" [step_count]="step_count"/>',
})

export class TenByTenComponent {
  step_count = 4
}
