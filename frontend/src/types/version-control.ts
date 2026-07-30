export interface Branch { _id: string; name: string; isDefault: boolean; isCurrent: boolean; createdAt: string; }
export interface Commit { _id: string; message: string; hash: string; changedFiles: string[]; createdAt: string; branch: { name: string }; author: { name: string; email: string }; }
