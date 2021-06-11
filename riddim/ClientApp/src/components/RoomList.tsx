import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationDispatch } from "../store";
import * as RoomStore from '../store/RoomStore';
import { RoomListLayout } from "../ui/RoomListComponents";
import LoadingAnimation from "./LoadingAnimation";
import RoomListItem from "./RoomListItem";

const RoomList: FC = () => {
    const dispatch: ApplicationDispatch = useDispatch();
    useEffect(() => {
        dispatch(RoomStore.actionCreators.getList())
    }, [dispatch]);

    const roomList = useSelector(RoomStore.selectors.list);

    if (!roomList || roomList.status === 'PENDING') {
        return <LoadingAnimation/>
    }

    switch (roomList.status) {
        case 'COMPLETE':
            return <RoomListLayout>{roomList.data.items.map(item => (<RoomListItem key={item.id} item={item} />))}</RoomListLayout>
        case 'ERROR':
            return <p>Could not load room list</p>
    }
}

export default RoomList;