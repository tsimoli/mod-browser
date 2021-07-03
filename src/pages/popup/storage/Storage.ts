export async function get<T>(key: string): Promise<T> {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (obj: any) => {
      // {accessToken": "", refeshToken: ""};
      if (obj != null && obj[key] != null) {
        resolve(obj[key] as T);
        return;
      }
      resolve(null);
    });
  });
}

export async function has(key: string): Promise<boolean> {
  return (await this.get(key)) != null;
}

export async function save(key: string, obj: any): Promise<any> {
  if (obj == null) {
    // Fix safari not liking null in set
    return new Promise<void>((resolve) => {
      chrome.storage.local.remove(key, () => {
        resolve();
      });
    });
  }

  if (obj instanceof Set) {
    obj = Array.from(obj);
  }

  const keyedObj = { [key]: obj };
  return new Promise<void>((resolve) => {
   chrome.storage.local.set(keyedObj, () => {
      resolve();
    });
  });
}

export async function remove(key: string): Promise<any> {
  return new Promise<void>((resolve) => {
    chrome.storage.local.remove(key, () => {
      resolve();
    });
  });
}
