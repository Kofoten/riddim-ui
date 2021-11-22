import React, { FC, useState } from 'react';
import { PlayerButton, PlayerPausedBorder, PlayerPlayingImage, PlayerWrapper } from '../ui/PlayerComponents';
import { Play } from '@styled-icons/boxicons-regular';
import { Volume, VolumeLow, VolumeFull, VolumeMute } from '@styled-icons/boxicons-solid';

interface PlayerProps {
    imageUrl: string
}

const getVolumeIcon = (muted: boolean, volume: number) => {
    if (muted) {
        return <VolumeMute/>
    }

    if (volume < .3) {
        return <Volume/>
    } else if (volume < .7) {
        return <VolumeLow/>
    } else {
        return <VolumeFull/>
    }
}

const Player: FC<PlayerProps> = (props) => {
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState(50);

    return <PlayerWrapper>
        <PlayerButton onClick={() => setPlaying(!playing)}>
            {playing && <PlayerPlayingImage src={props.imageUrl} />}
            {!playing && <PlayerPausedBorder><Play /></PlayerPausedBorder>}
        </PlayerButton>
        <div onClick={() => setMuted(!muted)}>{getVolumeIcon(muted, volume)}</div>
        <input type="range" min="0" max="1" step=".01" onChange={(e) => setVolume(parseFloat(e.target.value))} />
    </PlayerWrapper>
};

export default Player;