/* eslint-disable @typescript-eslint/naming-convention */
export class TextureSettings046 {
  constructor(textures: TextureSettings046_Texture[]) {
    this.json_format = "0.6.4";
    this["ori:textures"] = textures;
  }

  json_format: string;
  "ori:textures": TextureSettings046_Texture[];
}

export class TextureSettings046_Texture {
  constructor(id: string, path: string, pixel_unit: number | undefined) {
    this.id = id;
    this.path = path;
    this.pixel_unit = pixel_unit;
  }

  id: string;
  path: string;
  pixel_unit: number | undefined;
}
