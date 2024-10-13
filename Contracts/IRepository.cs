using System.Linq.Expressions;
using Models.Entities;

namespace Contracts
{
    public interface IRepository<T> where T : BaseEntity, new()
    {
        void CreateRange(IEnumerable<T> entities);
        void Update(T entity);
        void Delete(T entity);
    }
}
