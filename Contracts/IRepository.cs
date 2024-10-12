using System.Linq.Expressions;
using Models.Entities;

namespace Contracts
{
    public interface IRepository<T> where T : BaseEntity, new()
    {
        IQueryable<T> GetAll(bool trackChanges);
        void Create(T entity);
        void Update(T entity);
        void Delete(T entity);
    }
}
