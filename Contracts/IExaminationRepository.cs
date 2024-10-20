using Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Contracts
{
    public interface IExaminationRepository : IRepository<ExaminationRecord>
    {
        Task<IEnumerable<ExaminationRecord>> GetAllExaminationsAsync(bool trackChanges);
        Task<ExaminationRecord> GetExaminationByIdAsync(Guid examinationId, bool trackChanges, params Expression<Func<ExaminationRecord, object>>[] includes);
        void CreateExamination(ExaminationRecord examination);
    }
}
