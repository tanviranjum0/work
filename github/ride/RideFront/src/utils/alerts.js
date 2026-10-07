// Attention cues for time-sensitive events (a new ride request). All are best-effort:
// browsers block audio until the person has interacted with the page, and many desktops
// have no vibration motor, so every call is wrapped and silent on failure.
let audioContext;

export function chime() {
  try {
    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    [660, 880].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, now + index * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.18, now + index * 0.18 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.18 + 0.28);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(now + index * 0.18);
      oscillator.stop(now + index * 0.18 + 0.3);
    });
  } catch {
    /* audio unavailable */
  }
}

export function buzz(pattern = [120, 60, 120]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* vibration unavailable */
  }
}

export function notify(title, body) {
  try {
    if (document.hidden && "Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, icon: "/icon-quickride.png", tag: "quickride" });
    }
  } catch {
    /* notifications unavailable */
  }
}

export async function askNotificationPermission() {
  try {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  } catch {
    /* ignore */
  }
}
