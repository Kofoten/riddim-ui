import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { ApplicationDispatch } from '../store';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import * as RoomStore from '../store/RoomStore';
import Room, { RoomUpdate } from '../entities/room';

interface RoomEditFormCreateProps {
    mode: 'CREATE'
}

interface RoomEditFormEditProps {
    mode: 'EDIT',
    id: string,
    room: Room
}

export type RoomEditFormProps = RoomEditFormCreateProps | RoomEditFormEditProps;

const schema = yup.object().shape({
    name: yup.string()
        .required("Required")
        .max(64, "Maximum length is 64"),
    slug: yup.string()
        .required("Required")
        .max(64, "Maximum length is 64")
        .matches(/^[0-9a-z_-]*$/, "Must only contain digits, lowercase letters, - or _"),
    description: yup.string()
        .max(256, "Maximum length is 256"),
    imageUrl: yup.string()
        .max(128, "Maximum length is 128")
        .url("Must be a valid url")
})

const RoomEditForm: FC<RoomEditFormProps> = (props) => {
    const dispatch: ApplicationDispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm<RoomUpdate>({
        resolver: yupResolver(schema)
    });
    const onSubmit = (data: RoomUpdate) => {
        switch (props.mode) {
            case 'CREATE':
                dispatch(RoomStore.actionCreators.create(data));
                break;
            case 'EDIT':
                dispatch(RoomStore.actionCreators.edit(props.id, data));
                break;
        }
    }

    return <form onSubmit={handleSubmit(onSubmit)}>
        <input defaultValue={props.mode === 'EDIT' ? props.room.name : ''} {...register("name")} />
        <p>{errors.name?.message}</p>
        <input defaultValue={props.mode === 'EDIT' ? props.room.slug : ''} {...register("slug")} />
        <p>{errors.slug?.message}</p>
        <input defaultValue={props.mode === 'EDIT' ? props.room.description : ''} {...register("description")} />
        <p>{errors.description?.message}</p>
        <input defaultValue={props.mode === 'EDIT' ? props.room.imageUrl : ''} {...register("imageUrl")} />
        <p>{errors.imageUrl?.message}</p>
        <input id="submit" type="submit" />
    </form>
}

export default RoomEditForm;