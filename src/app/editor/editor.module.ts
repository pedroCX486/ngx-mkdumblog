import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EditorRoutingModule } from './editor-routing.module';
import { CanvasComponent } from './canvas/canvas.component';


@NgModule({
  declarations: [CanvasComponent],
  imports: [
    FormsModule,
    CommonModule,
    EditorRoutingModule
  ]
})
export class EditorModule { }
