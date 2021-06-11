import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationDispatch } from '../store';
import * as RoomStore from '../store/RoomStore';

const Room: FC<RouteComponentProps<{ slug: string }>> = (props) => {
    const settings = useSelector(RoomStore.selectors.settings)[props.match.params.slug];
    const dispatch: ApplicationDispatch = useDispatch();
    useEffect(() => {
        if (!settings) {
            dispatch(RoomStore.actionCreators.getSettings(props.match.params.slug));
        }
    }, [dispatch, props.match.params.slug, settings]);

    if (settings) {
        switch (settings.status) {
            case 'PENDING':
                return <p>Loading...</p>
            case 'COMPLETE':
                return <p>{settings.data.name}</p>
            case 'ERROR':
                return <p>{settings.error.message}</p>
        }
    }

    return null;
};

export default Room;