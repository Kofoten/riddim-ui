import React, { FC } from 'react';
import Room from '../entities/room';

interface RoomEditFormCreateProps {
    mode: 'CREATE'
}

interface RoomEditFormEditProps {
    mode: 'EDIT',
    room: Room
}

export type RoomEditFormProps = RoomEditFormCreateProps | RoomEditFormEditProps;

const RoomEditForm: FC<RoomEditFormProps> = (props) => {
    return <form>
        </form>
}

export default RoomEditForm;