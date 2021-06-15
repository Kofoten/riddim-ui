export default interface Room {
    id: string,
    name: string,
    slug: string,
    description: string,
    sources: object[],
    imageUrl: string
}

export type RoomUpdate = Partial<Omit<Room, 'id'>>