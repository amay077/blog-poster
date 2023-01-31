import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { MdEditorOption, UploadResult } from 'ngx-markdown-editor';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { CacheService } from 'src/app/service/cache.service';
import { DraftService } from 'src/app/service/draft.service';
import { GithubService, PostMeta } from 'src/app/service/github.service';

function isSmartPhone() {
  if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
    return true;
  } else {
    return false;
  }
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  loading = false;
  showPreviewPanel = false;
  dirty = false;
  isNew = false;

  private readonly onDestroy$ = new Subject();

  public options: MdEditorOption = {
    showPreviewPanel: this.showPreviewPanel,
    enablePreviewContentClick: false,
    hideIcons: ['Image', 'TogglePreview'], // ['Bold', 'Italic', 'Heading', 'Refrence', 'Link', 'Image', 'Ul', 'Ol', 'Code', 'TogglePreview', 'FullScreen']. Default is empty
    showBorder: false,
    resizable: false,
    fontAwesomeVersion: "6",
    markedjsOpt: { sanitize: true }
  };
  public content: string = '';
  public mode: string = "editor";

  private meta: PostMeta | undefined;
  fileName: string = '';

  private readonly template = `---
templateKey: blog-post
title: TITLE
date: ${dayjs().toISOString()}
tags:
  - Tag1
---
`;

  private readonly contentChange$ = new Subject<string>();
  isMobile: boolean = false;
  showPreview = false;

  constructor(
    private github: GithubService,
    private cache: CacheService,
    private draft: DraftService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.isMobile = isSmartPhone();

    if (!this.isMobile) {
      this.options.showPreviewPanel = true;
      this.options = Object.assign({}, this.options);
      this.showPreview = true;
    }
  }

  back() {
    history.back();
  }

  async ngOnInit(): Promise<void> {

    this.contentChange$
      .pipe(debounceTime(500), takeUntil(this.onDestroy$))
      .subscribe(content => {
        this.draft.saveDraft(this.meta?.name ?? 'new', content);
    });

    try {
      this.loading = true;
      const name = this.route.snapshot.paramMap.get('name') ?? 'new';
      const backup = this.draft.loadDraft(name ?? 'new');

      const restore = backup != null;
      this.isNew = name == 'new';
      if (name == 'new') {
        this.fileName = '(New document)';
        this.content = restore ? backup! : this.template;
      } else {
        const post = (await this.github.getPostMeta(name))!;
        this.meta = post.meta;
        this.fileName = post.meta.name;
        const text = post.markdown;
        this.content = restore ? backup! : text;
      }


    } finally {
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(null);
  }

  changeMode() {
    if (this.isMobile) {
      if (this.mode === "editor") {
        this.mode = "preview";
      } else {
        this.mode = "editor";
      }
    } else {
      this.options.showPreviewPanel = !this.options.showPreviewPanel;
      this.options = Object.assign({}, this.options);
    }
    this.showPreview = !this.showPreview;
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

    const uploadResult = await this.uploadFile(file);
    if (uploadResult != null) {
      return [uploadResult];
    } else {
      return [];
    }
  }

  private async uploadFile(file: File): Promise<UploadResult | null> {
    const url = await this.github.uploadImage(file)

    if (url != null) {
      return {
        name: file.name,
        url,
        isImg: file.type.indexOf("image") !== -1
      };
    } else {
      return null;
    }
  }

  async uploadImg(evt: any) {
    const file: File = evt?.target?.files[0];
    if (!file) return;

    try {
      this.loading = true;
      const res = await this.uploadFile(file);
      if (res != null) {
        this.content += `![${res.name}](${res.url})`;
      }
    } finally {
      this.loading = false;
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
    if (!confirm('Realy publish?')) {
      return;
    }

    this.loading = true;

    if (this.meta != null) {
      await this.github.uploadPost(this.content, this.meta.name, this.meta.sha);
    } else {
      await this.github.uploadPost(this.content, `${dayjs().format(`YYYY-MM-DD-HH-mm-ss`)}.md`, );
    }

    this.draft.deleteDraft(this.meta?.name ?? 'new');
    this.cache.clearPosts();
    this.loading = false;

    this.router.navigate(['/'])
  }

  async delete() {
    if (!confirm('Realy delete?')) {
      return;
    }

    this.loading = true;

    if (this.meta?.sha != null) {
      await this.github.deletePost(this.meta.name, this.meta.sha);
    }

    this.draft.deleteDraft(this.meta?.name ?? 'new');
    this.cache.clearPosts();
    this.loading = false;

    this.router.navigate(['/'])
  }

  async discard() {
    if (!confirm('Realy discard changes?')) {
      return;
    }

    this.loading = true;

    this.draft.deleteDraft(this.meta?.name ?? 'new');
    location.reload();
    this.loading = false;
  }

  onModelChange(content: string) {
    this.dirty = true;
    this.contentChange$.next(content);
  }
}
