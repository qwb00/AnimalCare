using Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contracts
{
    public interface IExaminationRepository : IRepository<ExaminationRecord>
    {
        Task<IEnumerable<ExaminationRecord>> GetAllRecordsAsync(bool trackChanges);
        void CreateExamination(ExaminationRecord examination, Guid careTakerId);
    }
}
