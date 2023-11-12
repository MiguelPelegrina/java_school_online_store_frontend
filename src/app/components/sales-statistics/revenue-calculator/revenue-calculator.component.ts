import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { OrderService } from 'src/app/services/order/order.service';
import { DATE_FORMAT } from 'src/app/shared/utils/string-values';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-revenue-calculator',
  templateUrl: './revenue-calculator.component.html',
  styleUrls: ['./revenue-calculator.component.css', '../../../app.component.css']
})
export class RevenueCalculatorComponent implements AfterViewInit, OnInit {
  // Fields
  protected calculatedValue: number = 0;

  protected fb: FormBuilder = new FormBuilder();

  protected form!: FormGroup;

  protected revenueOfCurrentMonth: number = 0;

  protected revenueOfCurrentWeek: number = 0;

  protected revenueOfLastMonth: number = 0;

  protected revenueOfLastWeek: number = 0;

  protected revenueOfLast7Days: number = 0;

  protected revenueOfLast30Days: number = 0;

  protected sevenDaysBefore: string = this.get7daysBefore();

  protected thirtyDaysBefore: string = this.get30daysBefore();

  protected startOfMonth: string = this.getStartOfMonth();

  protected startOfWeek: string = this.getStartOfWeek();

  protected startOfLastMonth: string = this.getStartOfLastMonth();

  protected startOfLastWeek: string = this.getStartOfLastWeek();

  protected endOfLastMonth: string = this.getEndOfLastMonth();

  protected endOfLastWeek: string = this.getEndOfLastWeek();

  protected today: string = this.getToday();

  constructor(private orderService: OrderService){}

  public ngOnInit(): void {
    this.initializeForm();
  }


  public ngAfterViewInit(): void {
    // Calculate revenue of current month
    this.orderService.getRevenue(this.startOfMonth, this.today)
      .subscribe((response) => this.revenueOfCurrentMonth = response);

    // Calculate revenue of previous month
    this.orderService.getRevenue(this.startOfLastMonth, this.endOfLastMonth)
      .subscribe((response) => this.revenueOfLastMonth = response);

    // Calculate revenue of current week
    this.orderService.getRevenue(this.startOfWeek, this.today)
      .subscribe((response) => this.revenueOfCurrentWeek = response);

    // Calculate revenue of previous week
    this.orderService.getRevenue(this.startOfLastWeek, this.endOfLastWeek)
      .subscribe((response) => this.revenueOfLastWeek = response)

    // Calculate revenue of the last 7 days
    this.orderService.getRevenue(this.sevenDaysBefore, this.today)
      .subscribe((response) => this.revenueOfLast7Days = response);

    // Calculate revenue of the last 30 days
    this.orderService.getRevenue(this.thirtyDaysBefore, this.today)
      .subscribe((response) => this.revenueOfLast30Days = response);
  }

  protected onSubmit(){
    const startDate = moment(this.form.value.startDate).format(DATE_FORMAT);
    const endDate = moment(this.form.value.endDate).format(DATE_FORMAT);

    if (startDate && endDate) {
      this.orderService.getRevenue(startDate, endDate).subscribe((response) => {
        this.calculatedValue = response;
      });
    }
  }

  // Private methods
  private initializeForm(): void {
    this.form = this.fb.group({
      startDate: new FormControl<Date | null>(null),
      endDate: new FormControl<Date | null>(null),
    });
  }

  private get7daysBefore(): string {
   return moment().subtract(7, 'days').format(DATE_FORMAT);
  }

  private get30daysBefore(): string {
   return moment().subtract(30, 'days').format(DATE_FORMAT);
  }

  private getEndOfLastMonth(): string {
    return moment().subtract(1, 'months').endOf('month').format(DATE_FORMAT);
  }

  private getEndOfLastWeek(): string {
    return moment().subtract(1, 'weeks').endOf('week').format(DATE_FORMAT);
  }

  private getStartOfMonth(): string {
    return moment().startOf('month').format(DATE_FORMAT);
  }

  private getStartOfWeek(): string {
    return moment().startOf('week').format(DATE_FORMAT);
  }

  private getStartOfLastMonth(): string {
    return moment().subtract(1, 'months').startOf('month').format(DATE_FORMAT);
  }

  private getStartOfLastWeek(): string {
    return moment().subtract(1, 'weeks').startOf('week').format(DATE_FORMAT);
  }

  private getToday(): string {
    return moment().format(DATE_FORMAT);
  }
}
