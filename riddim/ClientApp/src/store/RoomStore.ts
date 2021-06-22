import { Dispatch, Reducer } from 'redux';
import { ApplicationState } from '.';
import jsonFetch from '../common/jsonFetch';
import PagedSearchQuery from '../common/pagedSearchQuery';
import { converToQueryString } from '../common/queryHelper';
import { ReduxFetchState } from '../common/reduxFetchState';
import PageResult from '../entities/pageResult';
import Room, { RoomUpdate } from '../entities/room';

// STATE
export interface RoomCache { [key: string]: ReduxFetchState<Room> };
export interface SlugLookup { [key: string]: ReduxFetchState<string> };

export interface RoomState {
    status: 'PENDING' | 'COMPLETE'| 'ERROR' | 'NONE',
    roomCache: RoomCache,
    slugLookup: SlugLookup
}

// ACTIONS
interface GetRooms { type: 'GET_ROOMS', fetchState: ReduxFetchState<PageResult<Room>> };
interface GetRoomBySlug { type: 'GET_ROOM_BY_SLUG', slug: string, fetchState: ReduxFetchState<Room> };
interface GetRoom { type: 'GET_ROOM', id: string, fetchState: ReduxFetchState<Room> };
interface CreateRoom { type: 'CREATE_ROOM', fetchState: ReduxFetchState<Room> };
interface EditRoom { type: 'EDIT_ROOM', fetchState: ReduxFetchState<Room> };

export type RoomAction = GetRooms | GetRoomBySlug | GetRoom | CreateRoom | EditRoom;

// INITIAL STATE
const INITIAL_STATE: RoomState = {
    status: 'NONE',
    roomCache: {},
    slugLookup: {}
}

// ACTION CREATORS
export const actionCreators = {
    getList: (pagedSearchQuery?: PagedSearchQuery) => async (dispatch: Dispatch<RoomAction>) => {
        dispatch({ type: 'GET_ROOMS', fetchState: { status: 'PENDING' } })

        let query = '';
        if (pagedSearchQuery) {
            query = converToQueryString(pagedSearchQuery);
        }

        try {
            var response = await jsonFetch<PageResult<Room>>(`${window.location.origin}/api/room${query}`);
            dispatch({ type: 'GET_ROOMS', fetchState: { status: 'COMPLETE', data: response.jsonData } })
        } catch (error) {
            dispatch({ type: 'GET_ROOMS', fetchState: { status: 'ERROR', error } })
        }
    },
    getBySlug: (slug: string) => async (dispatch: Dispatch<RoomAction>, getState: () => ApplicationState) => {
        const state = getState();
        if (!state.room || !state.room.slugLookup[slug]) {
            dispatch({ type: 'GET_ROOM_BY_SLUG', slug, fetchState: { status: 'PENDING' } })
        }

        try {
            var response = await jsonFetch<Room>(`${window.location.origin}/api/room/${slug}`);
            dispatch({ type: 'GET_ROOM_BY_SLUG', slug, fetchState: { status: 'COMPLETE', data: response.jsonData } })
        } catch (error) {
            dispatch({ type: 'GET_ROOM_BY_SLUG', slug, fetchState: { status: 'ERROR', error } })
        }
    },
    get: (id: string, dispatchPending: boolean = false) => async (dispatch: Dispatch<RoomAction>, getState: () => ApplicationState) => {
        const state = getState();
        if (dispatchPending || !state.room || !state.room.roomCache[id]) {
            dispatch({ type: 'GET_ROOM', id, fetchState: { status: 'PENDING' } })
        }

        try {
            var response = await jsonFetch<Room>(`${window.location.origin}/api/room/${id}?keyType=id`);
            dispatch({ type: 'GET_ROOM', id, fetchState: { status: 'COMPLETE', data: response.jsonData } })
        } catch (error) {
            dispatch({ type: 'GET_ROOM', id, fetchState: { status: 'ERROR', error } })
        }
    },
    create: (data: RoomUpdate) => async (dispatch: Dispatch<RoomAction>) => {
        dispatch({ type: 'CREATE_ROOM', fetchState: { status: 'PENDING' } });

        try {
            var response = await jsonFetch<Room>(`${window.location.origin}/api/room`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            dispatch({ type: 'CREATE_ROOM', fetchState: { status: 'COMPLETE', data: response.jsonData } });
        } catch (error) {
            dispatch({ type: 'CREATE_ROOM', fetchState: { status: 'ERROR', error } });
        }
    },
    edit: (id: string, data: RoomUpdate) => async (dispatch: Dispatch<RoomAction>) => {
        dispatch({ type: 'EDIT_ROOM', fetchState: { status: 'PENDING' } });

        try {
            var response = await jsonFetch<Room>(`${window.location.origin}/api/room/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            dispatch({ type: 'EDIT_ROOM', fetchState: { status: 'COMPLETE', data: response.jsonData } });
        } catch (error) {
            dispatch({ type: 'EDIT_ROOM', fetchState: { status: 'ERROR', error } });
        }
    }
};

// REDUCER
const roomCacheReducer = (cache: RoomCache, room: Room): RoomCache => ({ ...cache, [room.id]: { status: 'COMPLETE', data: room } })

export const reducer: Reducer<RoomState, RoomAction> = (state = INITIAL_STATE, action): RoomState => {
    switch (action.type) {
        case 'GET_ROOMS':
            switch (action.fetchState.status) {
                case 'COMPLETE':
                    const roomCacheAdd = action.fetchState.data.items.reduce<RoomCache>(roomCacheReducer, {});
                    return {
                        ...state,
                        status: action.fetchState.status,
                        roomCache: {
                            ...state.roomCache,
                            ...roomCacheAdd
                        },
                    }
                default:
                    return {
                        ...state,
                        status: action.fetchState.status
                    };
            }
        case 'GET_ROOM_BY_SLUG':
            switch (action.fetchState.status) {
                case 'COMPLETE':
                    return {
                        ...state,
                        status: action.fetchState.status,
                        roomCache: {
                            ...state.roomCache,
                            [action.fetchState.data.id]: action.fetchState
                        },
                        slugLookup: {
                            ...state.slugLookup,
                            [action.slug]: { status: 'COMPLETE', data: action.fetchState.data.id }
                        }
                    }
                case 'PENDING':
                    return {
                        ...state,
                        status: action.fetchState.status,
                        slugLookup: {
                            ...state.slugLookup,
                            [action.slug]: { status: 'PENDING' }
                        }
                    }
                case 'ERROR':
                    return {
                        ...state,
                        status: action.fetchState.status,
                        slugLookup: {
                            ...state.slugLookup,
                            [action.slug]: { status: 'ERROR', error: action.fetchState.error }
                        }
                    }
            }
        case 'CREATE_ROOM':
            switch (action.fetchState.status) {
                case 'COMPLETE':
                    return {
                        ...state,
                        status: action.fetchState.status,
                        roomCache: {
                            ...state.roomCache,
                            [action.fetchState.data.id]: action.fetchState
                        },
                        slugLookup: {
                            ...state.slugLookup,
                            [action.fetchState.data.slug]: { status: 'COMPLETE', data: action.fetchState.data.id }
                        }
                    }
                default:
                    return {
                        ...state,
                        status: action.fetchState.status
                    };
            }
        case 'EDIT_ROOM':
            switch (action.fetchState.status) {
                case 'COMPLETE':
                    return {
                        ...state,
                        status: action.fetchState.status
                        roomCache: {
                            ...state.roomCache,
                            [action.fetchState.data.id]: action.fetchState
                        },
                        slugLookup: {
                            ...state.slugLookup,
                            [action.fetchState.data.slug]: { status: 'COMPLETE', data: action.fetchState.data.id }
                        }
                    }
                default:
                    return {
                        ...state,
                        status: action.fetchState.status
                    }
            }
        case 'GET_ROOM':
            return {
                ...state,
                status: action.fetchState.status,
                roomCache: {
                    ...state.roomCache,
                    [action.id]: action.fetchState
                }
            }
        default:
            return state;
    }
};

// SELECTORS
export const selectors = {
    status: (state: { room: RoomState }) => state.room.status,
    roomCache: (state: { room: RoomState }) => state.room.roomCache,
    slugLookup: (state: { room: RoomState }) => state.room.slugLookup,
}