import React, { FC, useState } from 'react';
import { PlayerButton, PlayerPlayingImage, PlayerWrapper } from '../ui/PlayerComponents';

interface PlayerProps {
    imageUrl: string
}

const Player: FC<PlayerProps> = (props) => {
    const [playing, setPlaying] = useState(false);

    return <PlayerWrapper>
        <PlayerButton onClick={() => setPlaying(!playing)}>
            {playing && <PlayerPlayingImage src={props.imageUrl}/>}
        </PlayerButton>
    </PlayerWrapper>
};

export default Player;