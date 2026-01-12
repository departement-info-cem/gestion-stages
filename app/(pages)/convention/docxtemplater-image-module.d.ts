declare module 'docxtemplater-image-module' {
  interface ImageModuleOptions {
    centered?: boolean;
    getImage: (tagValue: string) => ArrayBuffer | null;
    getSize: (img: ArrayBuffer, tagValue: string, tagName: string) => [number, number];
  }

  export default class ImageModule {
    constructor(options: ImageModuleOptions);
  }
}
