import { Component, Output } from '@angular/core';
import { getBase64 } from '../../utils/utils';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.css']
})
export class ImageSelectorComponent {
  // Fields
  protected file?: File;

  protected image: string | ArrayBuffer | null = '';

  // Methods
  // Public methods
  public getFile(){
    return this.file;
  }

  public getImage(){
    return this.image;
  }

  // Protected methods
  protected onFileSelected(event: any): void{
    const inputElement: HTMLInputElement = event.target;

    if (inputElement.files && inputElement.files[0]) {
      this.file = event.target.files[0];

      if(this.file){
        getBase64(this.file, (base64String) => {
          this.image = base64String
        });
      }
    }
  }
}
