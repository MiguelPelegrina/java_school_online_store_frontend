import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { StringValues } from 'src/app/shared/utils/string-values';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  constructor(@Inject(DOCUMENT) private document: Document) { }

  protected goToDocumentation(): void {
    this.document.location.href = StringValues.API_SPECIFICATION;
  }
}
