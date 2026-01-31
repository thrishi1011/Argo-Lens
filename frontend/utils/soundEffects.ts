class SoundManager {
    private sounds: Record<string, HTMLAudioElement>;

    constructor() {
        this.sounds = {
            click: new Audio('/sounds/click.mp3'),
            panelOpen: new Audio('/sounds/panel-open.mp3'),
            dataLoaded: new Audio('/sounds/data-loaded.mp3'),
            error: new Audio('/sounds/error.mp3')
        };

        // Set base volume
        Object.values(this.sounds).forEach(sound => {
            sound.volume = 0.3;
        });
    }

    play(soundName: string) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log('Sound play failed:', e));
        }
    }
}

export const soundManager = new SoundManager();
