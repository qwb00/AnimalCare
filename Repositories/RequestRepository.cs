using Contracts;
using Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class RequestRepository : RepositoryBase<Request>, IRequestRepository
    {
        public RequestRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }
    }
}
