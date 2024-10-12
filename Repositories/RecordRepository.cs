using Contracts;
using Models.Entities;

namespace Repositories
{
    public class RecordRepository : RepositoryBase<HealthRecord>, IRecordRepository
    {
        public RecordRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }
    }
}
