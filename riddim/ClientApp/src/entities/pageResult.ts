export default interface PageResult<TData> {
    page: number,
    pageSize: number,
    hasMore: boolean,
    items: TData[]
}