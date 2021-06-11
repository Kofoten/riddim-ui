import { Dispatch, Reducer } from 'redux';
import { ApplicationState } from '.';
import jsonFetch from '../common/jsonFetch';
import PagedSearchQuery from '../common/pagedSearchQuery';
import { converToQueryString } from '../common/queryHelper';
import { ReduxFetchState } from '../common/reduxFetchState';
import PageResult from '../entities/pageResult';
import RoomMetadata from '../entities/roomMetadata';
import RoomSettings from '../entities/roomSettings';

// STATE
export interface RoomState {
    list: ReduxFetchState<PageResult<RoomMetadata>> | null,
    settings: { [key: string]: ReduxFetchState<RoomSettings> }
}

// ACTIONS
interface GetRoomList { type: 'GET_ROOM_LIST', fetchState: ReduxFetchState<PageResult<RoomMetadata>> };
interface GetRoomSettings { type: 'GET_ROOM_SETTINGS', slug: string, fetchState: ReduxFetchState<RoomSettings> };

export type RoomAction = GetRoomList | GetRoomSettings;

// INITIAL STATE
const INITIAL_STATE: RoomState = {
    list: null,
    settings: {}
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
            var response = await jsonFetch<PageResult<RoomMetadata>>(`${window.location.origin}/api/room`);
            dispatch({ type: 'GET_ROOM_LIST', fetchState: { status: 'COMPLETE', data: response.jsonData } })
        } catch (error) {
            dispatch({ type: 'GET_ROOM_LIST', fetchState: { status: 'ERROR', error } })
        }
    },
    getSettings: (slug: string) => async (dispatch: Dispatch<RoomAction>, getState: () => ApplicationState) => {
        const state = getState();
        if (!state.room || !state.room.settings[slug]) {
            dispatch({ type: 'GET_ROOM_SETTINGS', slug, fetchState: { status: 'PENDING' } })
        }

        try {
            var response = await jsonFetch<RoomSettings>(`${window.location.origin}/api/room/${slug}`);
            dispatch({ type: 'GET_ROOM_SETTINGS', slug, fetchState: { status: 'COMPLETE', data: response.jsonData } })
        } catch (error) {
            dispatch({ type: 'GET_ROOM_SETTINGS', slug, fetchState: { status: 'ERROR', error } })
        }
    }
};

// REDUCER
export const reducer: Reducer<RoomState, RoomAction> = (state = INITIAL_STATE, action): RoomState => {
    switch (action.type) {
        case 'GET_ROOM_LIST':
            return {
                ...state,
                list: action.fetchState
            }
        case 'GET_ROOM_SETTINGS':
            switch (action.fetchState.status) {
                case 'COMPLETE':
                    return {
                        ...state,
                        settings: {
                            ...state.settings,
                            [action.slug]: action.fetchState,
                            [action.fetchState.data.slug]: action.fetchState
                        }
                    }
                default:
                    return {
                        ...state,
                        settings: {
                            ...state.settings,
                            [action.slug]: action.fetchState,
                        }
                    }
            }
        default:
            return state;
    }
};

// SELECTORS
export const selectors = {
    list: (state: { room: RoomState }) => state.room.list,
    settings: (state: { room: RoomState }) => state.room.settings
}