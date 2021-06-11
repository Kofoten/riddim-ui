import { Dispatch, Reducer } from 'redux';
import { ApplicationState } from '.';
import jsonFetch from '../common/jsonFetch';
import PagedSearchQuery from '../common/pagedSearchQuery';
import { converToQueryString } from '../common/queryHelper';
import { ReduxFetchState } from '../common/reduxFetchState';
import PageResult from '../entities/pageResult';
import RoomMetadata from '../entities/roomMetadata';
import Room from '../entities/room';

// STATE
export interface RoomState {
    list: ReduxFetchState<PageResult<RoomMetadata>> | null,
    roomCache: { [key: string]: ReduxFetchState<Room> }
    slugLookup: { [key: string]: ReduxFetchState<string> }
}

// ACTIONS
interface GetRoomList { type: 'GET_ROOM_LIST', fetchState: ReduxFetchState<PageResult<RoomMetadata>> };
interface GetRoomBySlug { type: 'GET_ROOM_BY_SLUG', slug: string, fetchState: ReduxFetchState<Room> };
interface GetRoom { type: 'GET_ROOM', id: string, fetchState: ReduxFetchState<Room> };

export type RoomAction = GetRoomList | GetRoomBySlug | GetRoom ;

// INITIAL STATE
const INITIAL_STATE: RoomState = {
    list: null,
    roomCache: {},
    slugLookup: {}
}

// ACTION CREATORS
export const actionCreators = {
    getList: (pagedSearchQuery?: PagedSearchQuery) => async (dispatch: Dispatch<RoomAction>, getState: () => ApplicationState) => {
        const state = getState();
        if (!state.room || !state.room.list) {
            dispatch({ type: 'GET_ROOM_LIST', fetchState: { status: 'PENDING' } })
        }

        let query = '';
        if (pagedSearchQuery) {
            query = converToQueryString(pagedSearchQuery);
        }

        try {
            var response = await jsonFetch<PageResult<RoomMetadata>>(`${window.location.origin}/api/room${query}`);
            dispatch({ type: 'GET_ROOM_LIST', fetchState: { status: 'COMPLETE', data: response.jsonData } })
        } catch (error) {
            dispatch({ type: 'GET_ROOM_LIST', fetchState: { status: 'ERROR', error } })
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
            var response = await jsonFetch<Room>(`${window.location.origin}/api/room/${id}`);
            dispatch({ type: 'GET_ROOM', id, fetchState: { status: 'COMPLETE', data: response.jsonData } })
        } catch (error) {
            dispatch({ type: 'GET_ROOM', id, fetchState: { status: 'ERROR', error } })
        }
    },
};

// REDUCER
export const reducer: Reducer<RoomState, RoomAction> = (state = INITIAL_STATE, action): RoomState => {
    switch (action.type) {
        case 'GET_ROOM_LIST':
            return {
                ...state,
                list: action.fetchState
            }
        case 'GET_ROOM_BY_SLUG':
            switch (action.fetchState.status) {
                case 'COMPLETE':
                    return {
                        ...state,
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
                        slugLookup: {
                            ...state.slugLookup,
                            [action.slug]: { status: 'PENDING' }
                        }
                    }
                case 'ERROR':
                    return {
                        ...state,
                        slugLookup: {
                            ...state.slugLookup,
                            [action.slug]: { status: 'ERROR', error: action.fetchState.error }
                        }
                    }
            }
        case 'GET_ROOM':
            return {
                ...state,
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
    list: (state: { room: RoomState }) => state.room.list,
    roomCache: (state: { room: RoomState }) => state.room.roomCache,
    slugLookup: (state: { room: RoomState }) => state.room.slugLookup,
}