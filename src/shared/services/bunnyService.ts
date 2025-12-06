export class BunnyService {
  private accessKey: string;
  private zone: string;
  private host: string;
  private cdn?: string;

  constructor() {
    this.accessKey = process.env.BUNNY_STORAGE_ACCESS_KEY || "";
    this.zone = process.env.BUNNY_STORAGE_ZONE || "";
    this.host = process.env.BUNNY_STORAGE_HOST || "storage.bunnycdn.com";
    this.cdn = process.env.BUNNY_CDN_BASE_URL;

    if (!this.accessKey) throw new Error("Missing BUNNY_STORAGE_ACCESS_KEY");
    if (!this.zone) throw new Error("Missing BUNNY_STORAGE_ZONE");
  }

  private url(path: string): string {
    const p = path.replace(/^\/+/, "");
    return `https://${this.host}/${this.zone}/${p}`;
  }

  getPublicUrl(path: string): string | undefined {
    if (!this.cdn) return undefined;
    const p = path.replace(/^\/+/, "");
    return `${this.cdn}/${p}`;
  }

  async upload(
    path: string,
    data: Buffer | string,
    contentType?: string
  ): Promise<{ url: string; publicUrl?: string }> {
    const res = await fetch(this.url(path), {
      method: "PUT",
      headers: {
        AccessKey: this.accessKey,
        ...(contentType ? { "Content-Type": contentType } : {}),
      },
      body: typeof data === "string" ? data : new Uint8Array(data),
    });
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    return { url: this.url(path), publicUrl: this.getPublicUrl(path) };
  }

  async download(path: string): Promise<Buffer> {
    const res = await fetch(this.url(path), {
      method: "GET",
      headers: { AccessKey: this.accessKey },
    });
    if (!res.ok) throw new Error(`Download failed: ${res.status}`);
    const ab = await res.arrayBuffer();
    return Buffer.from(ab);
  }

  async delete(path: string): Promise<void> {
    const res = await fetch(this.url(path), {
      method: "DELETE",
      headers: { AccessKey: this.accessKey },
    });
    if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
  }
}
