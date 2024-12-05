using Models.Entities;
using Shared.Enums;

namespace Repositories.Extensions
{
    public static class RepositoryAnimalExtensions
    {
        public static IQueryable<Animal> FilterAnimals(this IQueryable<Animal> animals, uint minAge, uint maxAge,
            string breed, string sex, string type, uint weight)
        {
            Sex? sexEnum = !string.IsNullOrWhiteSpace(sex) ? Enum.Parse<Sex>(sex, true) : null;
            Species? speciesEnum = !string.IsNullOrWhiteSpace(type) ? Enum.Parse<Species>(type, true) : null;

            return animals.Where(e => (e.Age >= minAge && e.Age <= maxAge) && (string.IsNullOrWhiteSpace(breed) || e.Breed == breed) &&
                 (!sexEnum.HasValue || e.Sex == sexEnum.Value) &&
                 (!speciesEnum.HasValue || e.Species == speciesEnum.Value) &&
                  (weight == 0 || e.Weight <= weight));
        }
        public static IQueryable<Animal> Search(this IQueryable<Animal> animals, string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return animals;
            var lowerCaseTerm = searchTerm.Trim().ToLower();
            return animals.Where(e => e.Name.ToLower().Contains(lowerCaseTerm));
        }

    }
}
