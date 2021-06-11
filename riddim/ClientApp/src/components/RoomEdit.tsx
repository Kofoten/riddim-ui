import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationDispatch } from '../store';
import * as RoomStore from '../store/RoomStore';
import LoadingAnimation from './LoadingAnimation';
import RoomEditForm from './RoomEditForm';

const RoomEdit: FC<RouteComponentProps<{ id: string }>> = (props) => {
    const room = useSelector(RoomStore.selectors.roomCache)[props.match.params.id]
    const dispatch: ApplicationDispatch = useDispatch();
    useEffect(() => {
        if (!room) {
            dispatch(RoomStore.actionCreators.get(props.match.params.id, true));
        }
    }, [dispatch, props.match.params.id, room]);

    if (room) {
        switch (room.status) {
            case 'PENDING':
                return <LoadingAnimation />
            case 'COMPLETE':
                return <RoomEditForm mode="EDIT" room={room.data} />
            case 'ERROR':
                return <p>{room.error.message}</p>
        }
    }

    return null;
}

export default RoomEdit;