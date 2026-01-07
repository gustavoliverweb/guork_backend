"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BunnyService = void 0;
class BunnyService {
    constructor() {
        this.accessKey = process.env.BUNNY_STORAGE_ACCESS_KEY || "";
        this.zone = process.env.BUNNY_STORAGE_ZONE || "";
        this.host = process.env.BUNNY_STORAGE_HOST || "storage.bunnycdn.com";
        this.cdn = process.env.BUNNY_CDN_BASE_URL;
        if (!this.accessKey)
            throw new Error("Missing BUNNY_STORAGE_ACCESS_KEY");
        if (!this.zone)
            throw new Error("Missing BUNNY_STORAGE_ZONE");
    }
    url(path) {
        const p = path.replace(/^\/+/, "");
        return `${this.host}/${this.zone}/${p}`;
    }
    getPublicUrl(path) {
        if (!this.cdn)
            return undefined;
        const p = path.replace(/^\/+/, "");
        return `${this.cdn}/${p}`;
    }
    async upload(path, data, contentType) {
        console.log(this.url(path));
        const res = await fetch(this.url(path), {
            method: "PUT",
            headers: {
                AccessKey: this.accessKey,
                ...(contentType ? { "Content-Type": contentType } : {}),
            },
            body: typeof data === "string" ? data : new Uint8Array(data),
        });
        console.log(res);
        if (!res.ok)
            throw new Error(`Upload failed: ${res.status}`);
        return {
            url: this.url(path),
            publicUrl: this.getPublicUrl(path),
            path: path,
        };
    }
    async download(path) {
        path = path.replace(this.cdn + "/", "");
        const res = await fetch(this.url(path), {
            method: "GET",
            headers: { AccessKey: this.accessKey },
        });
        if (!res.ok)
            throw new Error(`Download failed: ${res.status}`);
        const ab = await res.arrayBuffer();
        return Buffer.from(ab);
    }
    async delete(path) {
        path = path.replace(this.cdn + "/", "");
        const res = await fetch(this.url(path), {
            method: "DELETE",
            headers: { AccessKey: this.accessKey },
        });
        console.log(res);
        if (!res.ok)
            throw new Error(`Delete failed: ${res.status}`);
    }
}
exports.BunnyService = BunnyService;
