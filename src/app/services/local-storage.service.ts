import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private storage: Storage;

  constructor() { 
    this.storage = window.localStorage;
  }
  set(key: string, value: any,ttd:number): boolean {
    if (this.storage) {
      let item={
        value:value,
        expiry:new Date().getTime()+ ttd
      }
      this.storage.setItem(key, JSON.stringify(item));
      return true;
    }
    return false;
  }

  get(key: string): any {
    if (this.storage && this.storage.getItem(key)) {
        let item=JSON.parse(this.storage.getItem(key));
        if(item.expiry>new Date().getTime()){
              return item.value
        }else{
            this.remove(key)
            return null
        }
    }
    return null;
  }

  remove(key: string): boolean {
    if (this.storage) {
      this.storage.removeItem(key);
      return true;
    }
    return false;
  }

  clear(): boolean {
    if (this.storage) {
      this.storage.clear();
      return true;
    }
    return false;
  }

}
