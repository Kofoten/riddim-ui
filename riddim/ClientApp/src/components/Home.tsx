import React, { FC } from 'react';
import { LogoSvg, SeoHeader } from '../ui/LogoComponents';
import RoomList from './RoomList';

const Home: FC = () => {
    return (
        <div>
            <SeoHeader>Riddim</SeoHeader>
            <LogoSvg viewBox="0 0 800 180">
                <text text-anchor="middle" x="400" y="130">riddim</text>
            </LogoSvg>
            <RoomList/>
        </div>
    )
};

export default Home;
