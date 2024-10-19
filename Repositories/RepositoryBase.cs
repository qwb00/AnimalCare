using Microsoft.EntityFrameworkCore;
using Models.Entities;
using Contracts;
using System.Linq.Expressions;

namespace Repositories
{
    public abstract class RepositoryBase<T>(RepositoryContext context) : IRepository<T> where T : BaseEntity, new()
    {
        private readonly RepositoryContext context = context;
        private readonly DbSet<T> _dbSet = context.Set<T>();

        protected IQueryable<T> GetByCondition(Expression<Func<T, bool>> expression, bool trackChanges,
            params Expression<Func<T, object>>[]? includes)
        {
            var query = !trackChanges ?
            _dbSet.Where(expression).AsNoTracking() : _dbSet.Where(expression);

            if (includes != null && includes.Any())
            {
                query = includes.Aggregate(query, (current, include) => current.Include(include));
            }

            return query;
        }
        protected IQueryable<T> GetAll(bool trackChanges) => !trackChanges ?
            _dbSet.AsNoTracking() : _dbSet;

        public async Task<T> GetByIdAsync(Guid id, bool trackChanges)
            => await GetByCondition(e => e.Id == id, trackChanges).SingleOrDefaultAsync();

        protected void Create(T entity) => _dbSet.Add(entity);

        public virtual void CreateRange(IEnumerable<T> entities) => _dbSet.AddRange(entities);

        public void Update(T entity) => _dbSet.Update(entity);


        public virtual void Delete(T entity) => _dbSet.Remove(entity);

    }
}
