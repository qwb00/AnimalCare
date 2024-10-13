using Contracts;
using Microsoft.EntityFrameworkCore;
using Models.Entities;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Repositories
{
    public class ExaminationRepository : RepositoryBase<ExaminationRecord>, IExaminationRepository
    {
        public ExaminationRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
            
        }
        public async Task<IEnumerable<ExaminationRecord>> GetAllRecordsAsync(bool trackChanges) =>
                await GetAll(trackChanges).OrderBy(c => c.CreatedAt).ToListAsync();

        public void CreateExamination(ExaminationRecord examination, Guid careTakerId)
        {
            examination.CareTakerId = careTakerId;
            Create(examination);
        }
        
        // get all records for a specific animal
        public async Task<IEnumerable<ExaminationRecord>> GetRecordsByAnimalNameAsync(string animalName, bool trackChanges)
        {
            return await GetByCondition(e => e.Animal.Name.Equals(animalName), trackChanges, e => e.Animal)
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();
        }
    }
}
