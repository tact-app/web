import { makeObservable, observable, action, runInAction } from 'mobx';

class EmojiStoreClass {
  isLoaded: boolean = false;
  isLoading: boolean = false;
  hasError: boolean = false;
  emojiData: unknown;

  constructor() {
    makeObservable(this, {
      emojiData: observable,
      hasError: observable,
      isLoaded: observable,
      isLoading: observable,

      load: action.bound,
      loadIfNotLoaded: action.bound,
    });
  }

  load = async () => {
    runInAction(() => (this.isLoading = true));

    try {
      const response = await fetch(
        'https://cdn.jsdelivr.net/npm/@emoji-mart/data'
      );

      this.emojiData = response.json();
      this.isLoaded = true;
      runInAction(() => (this.isLoading = false));

      return this.emojiData;
    } catch (e) {
      this.hasError = true;
    }
  }

  loadIfNotLoaded = () => {
    if (!this.isLoaded && !this.isLoading) {
      return this.load();
    }
  }
}

export const EmojiStore = new EmojiStoreClass();
