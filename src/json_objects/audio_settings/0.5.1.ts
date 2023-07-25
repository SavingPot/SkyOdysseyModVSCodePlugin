/* eslint-disable @typescript-eslint/naming-convention */
export class AudioSettings051 {
  constructor(audio: AudioSettings051_Audio[]) {
    this.json_format = "0.5.1";
    this["ori:audio"] = audio;
  }

  json_format: string;
  "ori:audio": AudioSettings051_Audio[];
}

export class AudioSettings051_Audio {
  constructor(
    id: string,
    path: string,
    loop: boolean | undefined,
    audio_type: string | undefined,
    volume: number | undefined
  ) {
    this.id = id;
    this.path = path;
    this.loop = loop;
    this.audio_type = audio_type;
    this.volume = volume;
  }

  id: string;
  path: string;
  loop: boolean | undefined;
  audio_type: string | undefined;
  volume: number | undefined;
  play: AudioSettings051_Audio_Play | undefined;
}

export class AudioSettings051_Audio_Play {
  constructor(
    time_earliest: number | undefined,
    time_latest: number | undefined,
    not_during: boolean | undefined
  ) {
    this.time_earliest = time_earliest;
    this.time_latest = time_latest;
    this.not_during = not_during;
  }

  time_earliest: number | undefined;
  time_latest: number | undefined;
  not_during: boolean | undefined;
}
