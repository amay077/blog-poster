import { Component } from '@angular/core';
import axios from 'axios';
import { MdEditorOption, UploadResult } from 'ngx-markdown-editor';
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

  ngOnInit() {
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
    this.content = contentArr.join("\r\n");
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

  async doUpload(files: Array<File>): Promise<Array<UploadResult>> {
    console.log(files);
    const file = files[0];

    const fileToBase64 = (file: File): Promise<string> => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (r) => {
          const base64str = (r.target?.result as string).replace(/data:.*\/.*;base64,/, '');
          resolve(base64str);
        };
        reader.onerror = (e) => reject(e);
      });
    };

    const content = await fileToBase64(file);

    const data = JSON.stringify({
      'branch': 'develop',
      'message': 'upload image',
      'content': `${content}`
    });

    const token = '';
    const owner = 'amay077';
    const repo = 'blog-poster';

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/aaa/${ulid()}.png`;

    const p = {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': file.type
      },
      body: data
    };

    const res = await fetch(url, p);
    if (res.ok) {
      const resJson = await res.json();
      console.log(`${this.constructor.name} ~ doUpload ~ resJson`, resJson, resJson.content.download_url);

      return [{
        name: file.name,
        url: resJson.content.download_url,
        isImg: file.type.indexOf("image") !== -1
      }];
    } else {
      return [];
    }

    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     let result: Array<UploadResult> = [];
    //     for (let file of files) {
    //       result.push({
    //         name: file.name,
    //         url: `https://avatars3.githubusercontent.com/${file.name}`,
    //         isImg: file.type.indexOf("image") !== -1
    //       });
    //     }
    //     resolve(result);
    //   }, 3000);
    // });
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
}
