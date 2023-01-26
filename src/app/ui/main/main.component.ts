import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { MdEditorOption, UploadResult } from 'ngx-markdown-editor';
import { GithubService, PostMeta } from 'src/app/service/github.service';
import { ulid } from 'ulid'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  title = "blog-poster";

  showPreviewPanel = false;

  public options: MdEditorOption = {
    showPreviewPanel: this.showPreviewPanel,
    enablePreviewContentClick: false,
    hideIcons: ['TogglePreview'], // ['Bold', 'Italic', 'Heading', 'Refrence', 'Link', 'Image', 'Ul', 'Ol', 'Code', 'TogglePreview', 'FullScreen']. Default is empty
    showBorder: false,
    resizable: true,
    fontAwesomeVersion: "6",
    markedjsOpt: { sanitize: true }
  };
  public content: string = '';
  public mode: string = "editor";

  private meta: PostMeta | undefined;

  constructor(private github: GithubService, private route: ActivatedRoute) {
  }

  async ngOnInit(): Promise<void> {

    const name = this.route.snapshot.paramMap.get('name') ?? '';
    const meta = await this.github.getPostMeta(name);
    this.meta = meta;
    console.log(`${this.constructor.name} ~ ngOnInit ~ meta`, meta);
    if (meta == null) {
      return;
    }

    const res = await fetch(meta.download_url);
    const text = await res.text();
    console.log(`${this.constructor.name} ~ ngOnInit ~ text`, text);



    let contentArr = ["# Hello, Markdown Editor!"];
    contentArr.push("```javascript ");
    contentArr.push("function Test() {");
    contentArr.push('	console.log("Test");');
    contentArr.push("}");
    contentArr.push("```");
    contentArr.push(" Name | Type");
    contentArr.push(" ---- | ----");
    contentArr.push(" A | Test");
    contentArr.push(
      "![](http://lon-yang.github.io/markdown-editor/favicon.ico)"
    );
    contentArr.push("");
    contentArr.push("- [ ] Taks A");
    contentArr.push("- [x] Taks B");
    contentArr.push("- test");
    contentArr.push("");
    contentArr.push("[Link](https://www.google.com)");
    contentArr.push(`<img src="1" onerror="alert(1)" />`);
    contentArr.push("");
    this.content = text; //contentArr.join("\r\n");
  }

  changeMode() {
    if (this.mode === "editor") {
      this.mode = "preview";
    } else {
      this.mode = "editor";
    }
  }

  toggleShowPreviewPanel() {
    this.options.showPreviewPanel = !this.options.showPreviewPanel;
    this.options = Object.assign({}, this.options);
  }

  togglePreviewClick() {
    this.options.enablePreviewContentClick = !this.options
      .enablePreviewContentClick;
    this.options = Object.assign({}, this.options);
  }

  toggleResizeAble() {
    this.options.resizable = !this.options.resizable;
    this.options = Object.assign({}, this.options);
  }

  readonly doUpload = async (files: Array<File>): Promise<Array<UploadResult>> => {
    console.log(files);
    const file = files[0];

    const url = await this.github.uploadImage(file)

    if (url != null) {
      return [{
        name: file.name,
        url,
        isImg: file.type.indexOf("image") !== -1
      }];
    } else {
      return [];
    }
  }

  onEditorLoaded(editor: any) {
    console.log(`ACE Editor Ins: `, editor);

    editor.setShowPrintMargin(false);

    // editor.setOption('showLineNumbers', false);

    // setTimeout(() => {
    //   editor.setOption('showLineNumbers', true);
    // }, 2000);
  }

  preRender(mdContent: string) {
    console.log(`preRender fired`);
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve(mdContent);
    //   }, 4000);
    // })
    return mdContent;
  }

  postRender(html: any) {
    console.log(`postRender fired`);
    // return '<h1>Test</h1>';
    return html;
  }

  onPreviewDomChanged(dom: HTMLElement) {
    console.log(`onPreviewDomChanged fired`);
    // console.log(dom);
    // console.log(dom.innerHTML)
  }

  async publish() {
    if (this.meta == null) {
      return;
    }
    await this.github.uploadPost(this.content, this.meta.name, this.meta.sha);
  }
}
