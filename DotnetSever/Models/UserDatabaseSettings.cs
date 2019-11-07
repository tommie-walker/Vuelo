
namespace RSIVueloAPI.Models
{
    public class UserDatabaseSettings : IUserDatabaseSettings
    {
        public string UserCollectionName { get; set; }
        public string VerifyCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
        public string EmailUser { get; set; }
        public string EmailPass { get; set; }
    }
}
