using Models.Entities;
using AutoMapper;
using Shared.DataTransferObjects;
using AnimalCare.Extensions;
using Shared.DataTransferObjects.ReservationsDTO;
using Shared.Enums;

namespace AnimalCare
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
           
            CreateMap<Animal, AnimalForCardsDto>();
            CreateMap<Animal, AnimalDetailedDto>().MapMembers(
                (dst => dst.ExaminationRecords, src => src.Examinations),
                (dst => dst.Reservations, src => src.Reservations)
                );
            CreateMap<AnimalDetailedDto, Animal>().Ignore(dst => dst.Examinations, dst => dst.Reservations);

            CreateMap<ExaminationRecord, ExaminationRecordForCaretaker>();
            
            CreateMap<ReservationForUpdateDto, Reservation>();
            
            CreateMap<ReservationForCreationDto, Reservation>()
                .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => src.ReservationDate.Date + src.StartTime))
                .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src => src.ReservationDate.Date + src.EndTime))
                .ForMember(dest => dest.isReserved, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.isAproved, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.IsEnded, opt => opt.MapFrom(src => false));
            
            CreateMap<Reservation, ReservationForConfirmationDto>()
                .ForMember(dest => dest.VolunteerName, opt => opt.MapFrom(src => src.Volunteer.FullName))
                .ForMember(dest => dest.AnimalName, opt => opt.MapFrom(src => src.Animal.Name))
                .ForMember(dest => dest.AnimalBreed, opt => opt.MapFrom(src => src.Animal.Breed))
                .ForMember(dest => dest.ReservationDate, opt => opt.MapFrom(src => src.StartDate.Date))
                .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => src.StartDate.TimeOfDay))
                .ForMember(dest => dest.EndTime, opt => opt.MapFrom(src => src.EndDate.TimeOfDay))
                .ForMember(dest => dest.Photo, opt => opt.MapFrom(src => src.Animal.Photo));

            CreateMap<Reservation, ReservationForUserDto>()
                .ForMember(dest => dest.AnimalName, opt => opt.MapFrom(src => src.Animal.Name))
                .ForMember(dest => dest.AnimalBreed, opt => opt.MapFrom(src => src.Animal.Breed))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => DetermineReservationStatus(src)));

            CreateMap<ReservationForUpdateDto, Reservation>()
                .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => src.Date.Date + src.StartTime))
                .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src => src.Date.Date + src.EndTime))
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.VolunteerId, opt => opt.Ignore())
                .ForMember(dest => dest.AnimalId, opt => opt.Ignore());
        }
        
        private ReservationStatus DetermineReservationStatus(Reservation reservation)
        {
            if (reservation.isAproved && DateTime.Now < reservation.StartDate)
                return ReservationStatus.UPCOMING;
            else if (reservation.IsEnded && DateTime.Now > reservation.EndDate)
                return ReservationStatus.COMPLETED;
            else if (reservation is { isAproved: false, IsEnded: true })
                return ReservationStatus.CANCELED;
            else if (!reservation.IsEnded && DateTime.Now > reservation.EndDate)
                return ReservationStatus.MISSED;
            else
                return ReservationStatus.UPCOMING; // По умолчанию
        }
    }
}
