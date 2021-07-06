import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Header, HeaderTitle, MenuLayout } from '../ui/HeaderComponents';
import { HeroSvg, HeroWrapper, SeoHeader } from '../ui/HeroComponents';
import RoomList from './RoomList';

const Home: FC = () => {
    return (
        <div>
            <SeoHeader>Riddim</SeoHeader>
            <HeroWrapper>
                <HeroSvg viewBox="0 0 800 180">
                    <text textAnchor="middle" fill="#fff4d8" x="400" y="130">riddim</text>
                </HeroSvg>
            </HeroWrapper>
            <Header>
                <HeaderTitle>Rooms</HeaderTitle>
                <MenuLayout>
                    <Link to="/room/create">Create</Link>
                </MenuLayout>
            </Header>
            <RoomList/>
        </div>
    )
};

export default Home;
