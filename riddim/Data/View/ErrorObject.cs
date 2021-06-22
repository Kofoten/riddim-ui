namespace Riddim.Data.View
{
    public class ErrorObject
    {
        public string Code { get; init; }
        public string Description { get; init; }

        public static ErrorObject MissingRoomName => new()
        {
            Code = "MissingRoomName",
            Description = "The property 'name' is missong"
        };

        public static ErrorObject MissingRoomSlug => new()
        {
            Code = "MissingRoomSlug",
            Description = "The property 'slug' is missong"
        };

        public static ErrorObject InvalidRoomSlug => new()
        {
            Code = "InvalidRoomSlug",
            Description = "The value of property 'slug' is invalid"
        };

        public static ErrorObject UnavailableRoomName => new()
        {
            Code = "UnavailableRoomName",
            Description = "The room name is already in use"
        };

        public static ErrorObject UnavailableRoomSlug => new()
        {
            Code = "UnavailableRoomSlug",
            Description = "The room slug is already in use"
        };

        public static ErrorObject RoomNotFound => new()
        {
            Code = "RoomNotFound",
            Description = "The room could not be found"
        };

        public static ErrorObject InvalidKeyType => new()
        {
            Code = "InvalidKeyType",
            Description = "The key type is invalid"
        };

        public static ErrorObject InvalidIdFormat => new()
        {
            Code = "InvalidIdFormat",
            Description = "The format of the id is invalid"
        };

        public static ErrorObject UnexpectedDatabaseConflict => new()
        {
            Code = "UnexpectedDatabaseConflict",
            Description = "An unexpected conflict occurred in the database"
        };
    }
}
