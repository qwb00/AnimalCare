﻿using System.Linq.Expressions;
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
        public async Task<IEnumerable<ExaminationRecord>> GetAllExaminationsAsync(bool trackChanges) =>
            await GetAll(trackChanges)
                .Include(e => e.Animal)
                .Include(e => e.Veterinarian)
                .Include(e => e.Medicals)
                .OrderBy(e => e.Date)
                .ToListAsync();

        public void CreateExamination(ExaminationRecord examination) => Create(examination);
        
        public async Task<ExaminationRecord> GetExaminationByIdAsync(Guid examinationId, bool trackChanges, params Expression<Func<ExaminationRecord, object>>[] includes)
        {
            return await GetByCondition(e => e.Id == examinationId, trackChanges, includes).SingleOrDefaultAsync();
        }
        
        // get all records for a specific animal
        public async Task<IEnumerable<ExaminationRecord>> GetRecordsByAnimalNameAsync(string animalName, bool trackChanges)
        {
            return await GetByCondition(e => e.Animal.Name.Equals(animalName), trackChanges, e => e.Animal)
                .OrderBy(c => c.Date)
                .ToListAsync();
        }
    }
}
