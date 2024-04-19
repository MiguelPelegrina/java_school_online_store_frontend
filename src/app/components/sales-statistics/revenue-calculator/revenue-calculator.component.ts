import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { OrderService } from 'src/app/services/order/order.service';
import { DATE_FORMAT } from 'src/app/shared/utils/string-values';
import Chart from 'chart.js/auto';

/**
 * Component for calculating and displaying revenue statistics.
 */
@Component({
  selector: 'app-revenue-calculator',
  templateUrl: './revenue-calculator.component.html',
  styleUrls: ['./revenue-calculator.component.css', '../../../app.component.css']
})
export class RevenueCalculatorComponent implements AfterViewInit, OnInit {
  // Fields
  private static revenueOfCurrentYearByMonths: string = `Revenue of the current year (${moment().year()}) by months`;

  private static revenueOfLastYearByMonths: string = `Revenue of the last year (${moment().year()-1}) by months`;

  private static revenueOfLast12Months: string = 'Revenue of last 12 months';

  protected revenueChartOfCurrentYearByMonths?: any;

  protected revenueChartOfLastYearByMonths?: any;

  protected revenueChartOfLast12Months?: any;

  protected calculatedValue?: number;

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

  /**
   * Constructor
   * @param orderService The service for managing order-related operations.
   */
  constructor(private orderService: OrderService){}

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Initializes the form.
   */
  public ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * A lifecycle hook that is called after Angular has fully initialized a component's view.
   * Calculates the revenues from the order service.
   */
  public ngAfterViewInit(): void {
    // Calculate revenue of current month
    this.calculateRevenue(this.startOfMonth, this.today, 'revenueOfCurrentMonth');

    // Calculate revenue of previous month
    this.calculateRevenue(this.startOfLastMonth, this.endOfLastMonth, 'revenueOfLastMonth');

    // Calculate revenue of current week
    this.calculateRevenue(this.startOfWeek, this.today, 'revenueOfCurrentWeek');

    // Calculate revenue of previous week
    this.calculateRevenue(this.startOfLastWeek, this.endOfLastWeek, 'revenueOfLastWeek');

    // Calculate revenue of the last 7 days
    this.calculateRevenue(this.sevenDaysBefore, this.today, 'revenueOfLast7Days');

    // Calculate revenue of the last 30 days
    this.calculateRevenue(this.thirtyDaysBefore, this.today, 'revenueOfLast30Days');

    this.orderService.getRevenueOfYear(moment().format(DATE_FORMAT)).subscribe((response) => {
      this.createRevenueChartOfYearByMonths(moment.months(), RevenueCalculatorComponent.revenueOfCurrentYearByMonths, "revenueChartOfCurrentYearByMonths", response);
    });

    this.orderService.getRevenueOfYear(moment().subtract(1,'years').format(DATE_FORMAT)).subscribe((response) => {
      this.createRevenueChartOfYearByMonths(moment.months(), RevenueCalculatorComponent.revenueOfLastYearByMonths, "revenueChartOfLastYearByMonths", response);
    });

    this.orderService.getRevenueOfLast12Months(moment().format(DATE_FORMAT)).subscribe((response) => {
      this.createRevenueChartOfYearByMonths(this.getLast12Months(), RevenueCalculatorComponent.revenueOfLast12Months, "revenueChartOfLast12Months", response)
    });
  }

  /**
   * Handles form submission by calculating revenue within the specified date range.
   */
  protected onSubmit(){
    const startDate = moment(this.form.value.startDate).format(DATE_FORMAT);
    const endDate = moment(this.form.value.endDate).format(DATE_FORMAT);

    if (startDate && endDate) {
      this.calculateRevenue(startDate, endDate, 'calculatedValue');
    }
  }

  // Private methods
   /**
   * Initializes the form using the Form Builder.
   */
  private initializeForm(): void {
    this.form = this.fb.group({
      startDate: new FormControl<Date | null>(null),
      endDate: new FormControl<Date | null>(null),
    });
  }

  /**
   * Calculates revenue within the specified date range and updates the corresponding field.
   * @param startDate The start date of the range.
   * @param endDate The end date of the range.
   * @param targetField The field to update with the calculated revenue.
   */
  private calculateRevenue(startDate: string, endDate: string, targetField: string): void {
    const targetProperty = targetField as keyof RevenueCalculatorComponent;

    this.orderService.getTotalRevenue(startDate, endDate).subscribe((response) => {
      // Update the target field with the calculated revenue
      this[targetProperty] = response;
    });
  }

  /**
   * Creates a revenue chart for the last year by months.
   *
   * @param months - An array of month names (e.g., ['January', 'February', ...]).
   * @param revenueChartLabel - The label for the revenue chart dataset.
   * @param revenueChartId - The ID of the HTML canvas element where the chart will be rendered.
   * @param response - The data to be displayed on the chart, typically an array of numbers representing revenue for each month.
   */
  private createRevenueChartOfYearByMonths(months: string[], revenueChartLabel: string, revenueChartId: string, response: any){
    console.log(response)
    this.revenueChartOfLastYearByMonths = new Chart(revenueChartId, {
      type: 'bar',
      data: {
        labels: months,
          datasets: [
          {
            label: revenueChartLabel,
            data: response,
            backgroundColor: '#7b1fa2'
          },
        ]
      },
      options: {
        aspectRatio:2.5,
        plugins: {
          legend: {
            labels: {
              color: 'white'
            }
          }
        },
        responsive: true,
        scales: {
          y: {
            ticks: { color: 'white' }
          },
          x: {
            ticks: { color: 'white' }
          }
        }
      }
    });
  }

  // Helper methods for obtaining date strings
  /**
   * Gets the date string for 7 days before the current date.
   */
  private get7daysBefore(): string {
    return moment().subtract(7, 'days').format(DATE_FORMAT);
  }

  /**
   * Gets the date string for 30 days before the current date.
   */
  private get30daysBefore(): string {
    return moment().subtract(30, 'days').format(DATE_FORMAT);
  }

  /**
   * Gets the date string for the end of the last month.
   */
  private getEndOfLastMonth(): string {
    return moment().subtract(1, 'months').endOf('month').format(DATE_FORMAT);
  }

  /**
   * Gets the date string for the end of the last week.
   */
  private getEndOfLastWeek(): string {
    return moment().subtract(1, 'weeks').endOf('week').format(DATE_FORMAT);
  }

  /**
   * Gets the date string for the start of the current month.
   */
  private getStartOfMonth(): string {
    return moment().startOf('month').format(DATE_FORMAT);
  }

  /**
   * Gets the date string for the start of the current week.
   */
  private getStartOfWeek(): string {
    return moment().startOf('week').format(DATE_FORMAT);
  }

  /**
   * Gets the date string for the start of the last month.
   */
  private getStartOfLastMonth(): string {
    return moment().subtract(1, 'months').startOf('month').format(DATE_FORMAT);
  }

  /**
   * Gets the date string for the start of the last week.
   */
  private getStartOfLastWeek(): string {
    return moment().subtract(1, 'weeks').startOf('week').format(DATE_FORMAT);
  }

  /**
   * Gets the date string for today.
   */
  private getToday(): string {
    return moment().format(DATE_FORMAT);
  }

  /**
 * Generates an array of strings representing the last 12 months in the format 'YYYY-MM'.
 * Iterates over the last 12 months, starting from the current month, and formats each month as a string in the 'YYYY-MM' format.
 *
 * @returns {string[]} An array of strings, each representing a month in the 'YYYY-MM' format, for the last 12 months.
 */
  private getLast12Months(): string[] {
    const months: string[] = [];
    for (let i = 11; i >= 0; i--) {
       months.push(moment().subtract(i, 'months').format('MM-YYYY'));
    }
    return months;
  }
}
