import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationDispatch } from '../store';
import * as RoomStore from '../store/RoomStore';
import LoadingAnimation from './LoadingAnimation';
import Player from './Player';

const Room: FC<RouteComponentProps<{ slug: string }>> = (props) => {
    const roomId = useSelector(RoomStore.selectors.slugLookup)[props.match.params.slug];
    const roomCache = useSelector(RoomStore.selectors.roomCache);
    const dispatch: ApplicationDispatch = useDispatch();
    useEffect(() => {
        if (!roomId) {
            dispatch(RoomStore.actionCreators.getBySlug(props.match.params.slug));
        }
    }, [dispatch, props.match.params.slug, roomId, roomCache]);

    if (roomId) {
        switch (roomId.status) {
            case 'PENDING':
                return <LoadingAnimation />
            case 'COMPLETE':
                const room = roomCache[roomId.data];
                switch (room.status) {
                    case 'PENDING':
                        return <LoadingAnimation />
                    case 'COMPLETE':
                        return <>
                            <h1>{room.data.name}</h1>
                            <Player imageUrl={room.data.imageUrl}/>
                        </>
                    case 'ERROR':
                        return <p>{room.error.message}</p>
                }
            case 'ERROR':
                return <p>{roomId.error.message}</p>
        }
    }

    return null;
};

export default Room;