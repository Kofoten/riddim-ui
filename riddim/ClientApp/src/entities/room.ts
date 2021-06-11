export default interface Room {
    id: string,
    name: string,
    slug: string,
    description: string,
    sources: object[],
    imageUrl: string
}