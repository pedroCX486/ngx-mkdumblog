import { Component, OnInit, AfterViewInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { saveAs } from 'file-saver';
import { PostModel } from '@shared/models/post.model';
import { HelperService } from '@shared/services/helper.service';
import * as SimpleMDE from 'simplemde';
import MicroModal from 'micromodal';


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit {

  simplemde;

  content: PostModel = new PostModel();
  archives = [];
  filteredArchives = [];
  entryExists = false;

  constructor(private helperService: HelperService, private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.loadArchive();
    MicroModal.init();
  }

  ngAfterViewInit(): void {
    this.simplemde = new SimpleMDE({ element: document.getElementById("SimpleMDE") });
    this.resetEditor();
    this.changeDetector.detectChanges();
  }

  loadArchive(open?: boolean): void {
    if (open) {
      MicroModal.show('selectionModal');
    }

    this.helperService.getJSON('./assets/posts/archive.json').subscribe(data => {
      this.archives = data;
      this.filteredArchives = data;
    });
  }

  loadPost(post: string): void {
    this.helperService.getJSON('./assets/posts/' + post + '.json').toPromise()
      .then(data => this.content = data)
      .then(() => this.simplemde.value(this.content.postContent));
  }

  savePost(isDraft: boolean): void {
    this.content.draft = isDraft;

    if (isDraft) {
      MicroModal.show('draftModal');
    } else{
      MicroModal.show('saveModal');
    }

    if (!this.content.postTitle) {
      this.content.postTitle = 'No title.';
    }

    if (!this.content.postContent) {
      this.content.postContent = 'No content.';
    }

    if (isDraft) {
      // Save post as draft (no timestamps)
      this.content.filename = this.parseFilename();

      saveAs(new Blob(
        [JSON.stringify(this.content, null, 2)], { type: 'text/plain;charset=utf-8;' }), this.content.filename + '.json'
      );
    } else {
      // Save post for publishing
      this.content.filename = this.parseFilename();

      if (!this.content.timestamp) {
        this.content.timestamp = Math.round((new Date()).getTime() / 1000).toString();
      } else {
        this.content.editedTimestamp = Math.round((new Date()).getTime() / 1000).toString();
      }

      saveAs(new Blob(
        [JSON.stringify(this.content, null, 2)], { type: 'text/plain;charset=utf-8;' }), this.content.filename + '.json'
      );

      // Save archive but first check if the post exists, if so, don't save the archive
      const that = this;
      if (!this.archives.some((post => post.postTitle === that.content.postTitle))) {
        this.archives.unshift({
          postTitle: this.content.postTitle,
          timestamp: Math.round((new Date()).getTime() / 1000).toString(),
          filename: this.parseFilename()
        });

        saveAs(new Blob([JSON.stringify(this.archives, null, 2)], { type: 'text/plain;charset=utf-8;' }), 'archive.json');

        this.entryExists = false;
      } else {
        this.entryExists = true;
      }

      // Reload archive
      this.loadArchive();
    }
  }

  searchArhive(arg: string, clear?: boolean): void {
    if (!!arg) {
      this.filteredArchives = this.archives.filter(entry => entry.postTitle.toLowerCase().includes(arg.toLowerCase()));
    } else {
      this.filteredArchives = this.archives;
    }

    if (clear) {
      (document.getElementById('search') as HTMLInputElement).value = '';
    }
  }

  loadFromFile(fromFile): void {
    const that = this;
    const file = fromFile.target.files[0];
    const reader = new FileReader();
    let error = false;

    if (!file) {
      return;
    }

    reader.onload = (event => {
      const contents = (event.target as FileReader).result;

      // I know this is crazy but it works.
      try {
        if (Object.keys(JSON.parse(contents.toString())).toString() === Object.keys(that.content).toString()) {
          that.content = JSON.parse(contents.toString());
        } else {
          alert('Invalid file! Are you sure it\'s an Dumblog compatible JSON?');
          error = true;
          return;
        }
      } catch (e) {
        alert('Invalid file! Are you sure it\'s an Dumblog compatible JSON?');
        error = true;
        return;
      }

      document.getElementById('dismiss').click();
      (document.getElementById('file-input') as HTMLInputElement).value = '';
    });

    if (!error) {
      reader.readAsText(file);
    }
  }

  parseFilename(): string {
    let filename = this.content.postTitle;

    filename = filename.replace(/[^a-zA-Z0-9_]+/gi, '-').toLowerCase();

    while (filename.endsWith('-')) {
      filename = filename.slice(0, -1);
    }

    if (filename.length > 50) { // Limit filename size
      filename = filename.substring(0, 50);

      if (filename.includes('-')) {
        filename = filename.substr(0, Math.min(filename.length, filename.lastIndexOf('-'))); // Re-trim to avoid cutting a word in half.
      }
    }

    return filename;
  }

  parseTimestamp(timestamp): string {
    return new Date(timestamp * 1000).toUTCString();
  }

  resetEditor(): void {
    this.content = new PostModel();
    this.content.postTitle = '';
    this.content.postContent = 'A new post.';
    this.simplemde.value(this.content.postContent);
  }
}
