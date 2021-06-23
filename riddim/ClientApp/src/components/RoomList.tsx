import React, { FC, ReactElement, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationDispatch } from "../store";
import * as RoomStore from '../store/RoomStore';
import { RoomListLayout } from "../ui/RoomListComponents";
import LoadingAnimation from "./LoadingAnimation";
import RoomListItem, { RoomListItemProps } from "./RoomListItem";

const RoomList: FC = () => {
    const dispatch: ApplicationDispatch = useDispatch();
    const status = useSelector(RoomStore.selectors.status);
    const roomCache = useSelector(RoomStore.selectors.roomCache);
    const loader = useRef(null);
    useEffect(() => {
        dispatch(RoomStore.actionCreators.getList())
    }, [dispatch]);

    const rooms = Object.values(roomCache);
    if (rooms.length === 0) {
        return <LoadingAnimation/>
    }

    const items: ReactElement<RoomListItemProps>[] = [];
    rooms.forEach(room => {
        if (room.status === 'COMPLETE') {
            items.push(<RoomListItem key={room.data.id} item={room.data} />);
        }
    });

    return <>
        <RoomListLayout>{items}</RoomListLayout>
        {status === 'PENDING' && <LoadingAnimation />}
        {status === 'ERROR' && <p>Could not load room list</p>}
        <div ref={loader} />
     </>
}

export default RoomList;