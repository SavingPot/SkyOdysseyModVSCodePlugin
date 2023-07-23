/* eslint-disable @typescript-eslint/naming-convention */
//? joc === json object center

import * as vscode from "vscode";
import * as core from "./extension";
import * as fs from "fs";
import * as pathUtil from "path";
import { ModInfo064 } from "./json_objects/mod_info/0.6.4";
import {
  TextureSettings046,
  TextureSettings046_Texture,
} from "./json_objects/texture_settings/0.4.6";

export function writeInfo(id: string) {
  const data = new ModInfo064(id);
  const config = JSON.stringify(data);
  fs.writeFileSync(modInfoPath(), config);
}

export function writeTextureSetting(textures: TextureSettings046_Texture[]) {
  const data = new TextureSettings046(textures);
  const config = JSON.stringify(data);
  fs.writeFileSync(textureSettingsPath(), config);
}

export function loadTextureSetting(): TextureSettings046 {
  const content = fs.readFileSync(textureSettingsPath(), "utf-8");
  const result = JSON.parse(content);
  return result;
}

export function modSourcePath() {
  return pathUtil.join(core.getWorkspacePath(), "mod_source");
}

export function modAudioPath() {
  return pathUtil.join(modSourcePath(), "audio");
}

export function modLangsPath() {
  return pathUtil.join(modSourcePath(), "langs");
}

export function modTexturesPath() {
  return pathUtil.join(modSourcePath(), "textures");
}

export function modScriptsPath() {
  return pathUtil.join(modSourcePath(), "scripts");
}

export function modInfoPath() {
  return pathUtil.join(modSourcePath(), "mod_info.json");
}

export function textureSettingsPath() {
  return pathUtil.join(modSourcePath(), "texture_settings.json");
}

export function audioSettingsPath() {
  return pathUtil.join(modSourcePath(), "audio_settings.json");
}
