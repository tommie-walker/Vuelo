
namespace RSIVueloAPI.Models
{
    public class UserDatabaseSettings : IUserDatabaseSettings
    {
        public string UserCollectionName { get; set; }
        public string EmailAuthCollectionName { get; set; }
        public string JWTCollectionName { get; set; }
        public string SessionCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
        public string EmailUser { get; set; }
        public string EmailPass { get; set; }
        public string Secret { get; set; }
        public string Issuer { get; set; }
        public string Auidence { get; set; }
        public int AccessExpiration { get; set; }
        public int RefreshExpiration { get; set; }
    }
}
