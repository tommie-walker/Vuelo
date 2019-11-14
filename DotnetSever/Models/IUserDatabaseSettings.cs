
namespace RSIVueloAPI.Models
{
    public interface IUserDatabaseSettings
    {
        string UserCollectionName { get; set; }
        string EmailAuthCollectionName { get; set; }
        string JWTCollectionName { get; set; }
        string SessionCollectionName { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
        string EmailUser { get; set; }
        string EmailPass { get; set; }
        string Secret { get; set; }
        string Issuer { get; set; }
        string Auidence { get; set; }
        int AccessExpiration { get; set; }
        int RefreshExpiration { get; set; }
    }
}
