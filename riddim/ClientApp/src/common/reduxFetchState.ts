interface ReduxFetchStatePending {
    status: 'PENDING'
}

interface ReduxFetchStateComplete<TData> {
    status: 'COMPLETE',
    data: TData
}

interface ReduxFetchStateError {
    status: 'ERROR',
    error: Error
}

export type ReduxFetchState<TData> = ReduxFetchStatePending | ReduxFetchStateComplete<TData> | ReduxFetchStateError
