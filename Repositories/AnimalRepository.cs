using Contracts;
using Models.Entities;

namespace Repositories
{
    public class AnimalRepository : RepositoryBase<Animal>, IAnimalRepository
    {
        public AnimalRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }
    }
}
