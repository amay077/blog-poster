import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { MdEditorOption, UploadResult } from 'ngx-markdown-editor';
import { GithubService, PostMeta } from 'src/app/service/github.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  loading = false;
  showPreviewPanel = false;
  dirty = false;

  public options: MdEditorOption = {
    showPreviewPanel: this.showPreviewPanel,
    enablePreviewContentClick: false,
    hideIcons: ['TogglePreview'], // ['Bold', 'Italic', 'Heading', 'Refrence', 'Link', 'Image', 'Ul', 'Ol', 'Code', 'TogglePreview', 'FullScreen']. Default is empty
    showBorder: false,
    resizable: false,
    fontAwesomeVersion: "6",
    markedjsOpt: { sanitize: true }
  };
  public content: string = '';
  public mode: string = "editor";

  private meta: PostMeta | undefined;
  fileName: string = '';

  constructor(private github: GithubService, private router: Router, private route: ActivatedRoute) {
  }

  back() {
    history.back();
  }

  async ngOnInit(): Promise<void> {

    try {
      this.loading = true;
      const name = this.route.snapshot.paramMap.get('name') ?? '';

      if (name == 'new') {
        this.fileName = '(New document)';
        this.content = `---
templateKey: blog-post
title: TITLE
date: ${dayjs().toISOString()}
tags:
  - Tag1
---
`
      } else {
        const post = (await this.github.getPostMeta(name))!;
        this.meta = post.meta;
        this.fileName = post.meta.name;
        // const res = await fetch(post.meta.download_url);
        // const text = await res.text();
        const text = post.markdown;
        this.content = text;
      }

    } finally {
      this.loading = false;
    }
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
    if (this.meta != null) {
      await this.github.uploadPost(this.content, this.meta.name, this.meta.sha);
    } else {
      await this.github.uploadPost(this.content, `${dayjs().format(`YYYY-MM-DD-HH-mm-ss`)}.md`, );
    }

    this.router.navigate(['/'])
  }

  onModelChange(event: any) {
    this.dirty = true;
  }
}
