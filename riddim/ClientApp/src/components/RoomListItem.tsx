import React, { FC } from "react";
import { Link } from "react-router-dom";
import Room from "../entities/room";
import { RoomListItemLayout, RoomListItemImage, RoomListItemText } from "../ui/RoomListComponents";

export interface RoomListItemProps {
    item: Room
}

const RoomListItem: FC<RoomListItemProps> = (props) => {
    return <Link to={`/${props.item.slug}`}>
        <RoomListItemLayout>
            <RoomListItemImage src={props.item.imageUrl} />
            <RoomListItemText>
                <p>{props.item.name}</p>
                <p>{props.item.description}</p>
            </RoomListItemText>
        </RoomListItemLayout>
    </Link>
}

export default RoomListItem;