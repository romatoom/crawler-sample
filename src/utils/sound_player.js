import sound from "sound-play";

const SOUNDS = ["end", "fail"];

export default function soundPlay(name) {
  if (SOUNDS.includes(name)) {
    sound.play(`src/utils/${name}.mp3`);
  }
}
