/* eslint-disable @typescript-eslint/naming-convention */
export class ModInfo064 {
  constructor(id: string) {
    this.json_format = "0.6.4";
    this["ori:mod_info"] = new ModInfo064_ModInfo(id);
  }

  json_format: string;
  "ori:mod_info": ModInfo064_ModInfo;
}

class ModInfo064_ModInfo {
  constructor(id: string) {
    this.id = id;
    this.enabled = true;
    this.version = "0.0.1";
    this.display = new ModInfo064_ModInfo_Display(id);
  }

  id: string;
  enabled: boolean;
  version: string;
  display: ModInfo064_ModInfo_Display;
}

class ModInfo064_ModInfo_Display {
  constructor(id: string) {
    this.description = id + ":mod_description";
    this.name = id + ":mod_name";
  }

  description: string;
  name: string;
}
