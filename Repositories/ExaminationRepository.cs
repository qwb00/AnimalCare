using Contracts;
using Models.Entities;

namespace Repositories
{
    public class ExaminationRepository : RepositoryBase<ExaminationRecord>, IExaminationRepository
    {
        public ExaminationRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }
    }
}
