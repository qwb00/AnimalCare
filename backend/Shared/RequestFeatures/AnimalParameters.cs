namespace Shared.RequestFeatures
{
    public class AnimalParameters
    {
        public uint MinAge { get; set; }
        public uint MaxAge { get; set; } = int.MaxValue;
        public uint Weight {  get; set; }
        public string? Sex { get; set; }
        public string? Type { get; set; }
        public string? Breed { get; set; }

        public string? SearchTerm { get; set; }

        public bool ValidAgeRange => MaxAge > MinAge;
    }
}
