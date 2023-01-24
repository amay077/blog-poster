import { Component } from '@angular/core';
import axios from 'axios';
import { MdEditorOption, UploadResult } from 'ngx-markdown-editor';
import { Base64 } from 'js-base64';

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
    customRender: {
      image: function (href: string, title: string, text: string) {
        let out = `<img style="max-width: 100%; border: 20px solid red;" src="${href}" alt="${text}"`;
        if (title) {
          out += ` title="${title}"`;
        }
        // out += (<any>this.options).xhtml ? "/>" : ">";
        return out;
      }
    },
    fontAwesomeVersion: "6",
    // customIcons: {
    //   Bold: { fontClass: 'fa-solid fa-bold' },
    //   Italic: { fontClass: 'fa-solid fa-italic' },
    //   Heading: { fontClass: 'fa-solid fa-heading' },
    //   Reference: { fontClass: 'fa-solid fa-quote-left' },
    //   Link: { fontClass: 'fa-solid fa-link' },
    //   Image: { fontClass: 'fa-solid fa-image' },
    //   UnorderedList: { fontClass: 'fa-solid fa-list-ul' },
    //   OrderedList: { fontClass: 'fa-solid fa-list-ol' },
    //   CodeBlock: { fontClass: 'fa-solid fa-file-code' },
    //   ShowPreview: { fontClass: 'fa-solid fa-eye' },
    //   HidePreview: { fontClass: 'fa-solid fa-eye-slash' },
    //   FullScreen: { fontClass: 'fa-solid fa-maximize' },
    //   CheckBox_UnChecked: { fontClass: 'fa-regular fa-square' },
    //   CheckBox_Checked: { fontClass: 'fa-solid fa-check-square' }
    // },
    markedjsOpt: {
      sanitize: true
    }
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
      "message": "upload image",
      "content": `${content}`
    });

    const token = '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';
    const owner = 'amay077';
    const repo = 'blog-poster';

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/aaa/abcdef.png`;

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
