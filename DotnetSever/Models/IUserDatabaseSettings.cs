
namespace RSIVueloAPI.Models
{
    public interface IUserDatabaseSettings
    {
        string UserCollectionName { get; set; }
        string VerifyCollectionName { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}
