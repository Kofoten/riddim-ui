import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Header, HeaderTitle, MenuLayout } from '../ui/HeaderComponents';
import { LogoSvg, SeoHeader } from '../ui/LogoComponents';
import RoomList from './RoomList';

const Home: FC = () => {
    return (
        <div>
            <SeoHeader>Riddim</SeoHeader>
            <LogoSvg viewBox="0 0 800 180">
                <text textAnchor="middle" x="400" y="130">riddim</text>
            </LogoSvg>
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
