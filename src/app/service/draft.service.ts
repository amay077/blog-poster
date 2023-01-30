import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DraftService {
  constructor() { }

  private hashCode(s: string): string {
    let h = 0;
    for(let i = 0; i < s.length; i++)
          h = Math.imul(31, h) + s.charCodeAt(i) | 0;

    return h.toString(16);
  }

  loadDraft(name: string): string | null {
    const hash = this.hashCode(name);
    return localStorage.getItem(`posteiro-draft-${hash}`);
  }

  saveDraft(name: string, content: string) {
    const hash = this.hashCode(name);
    console.log(`On Save`, content, name ?? 'new', hash);
    localStorage.setItem(`posteiro-draft-${hash}`, content);
  }

  deleteDraft(name: string) {
    const hash = this.hashCode(name);
    localStorage.removeItem(`posteiro-draft-${hash}`);
  }

}
