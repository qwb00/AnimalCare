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
                .MapMembers(
                    (dst => dst.StartDate, src => src.ReservationDate.Date + src.StartTime),
                    (dst => dst.EndDate, src => src.ReservationDate.Date + src.EndTime)
                )
                .UseValue(dst => dst.isReserved, true)
                .UseValue(dst => dst.isAproved, false)
                .UseValue(dst => dst.IsEnded, false);
            
            CreateMap<Reservation, ReservationForConfirmationDto>()
                .MapMembers(
                    (dst => dst.VolunteerName, src => src.Volunteer.FullName),
                    (dst => dst.AnimalName, src => src.Animal.Name),
                    (dst => dst.AnimalBreed, src => src.Animal.Breed),
                    (dst => dst.ReservationDate, src => src.StartDate.Date),
                    (dst => dst.StartTime, src => src.StartDate.TimeOfDay),
                    (dst => dst.EndTime, src => src.EndDate.TimeOfDay),
                    (dst => dst.Photo, src => src.Animal.Photo)
                );
            
            CreateMap<Reservation, ReservationForUserDto>()
                .MapMembers(
                    (dst => dst.AnimalName, src => src.Animal.Name),
                    (dst => dst.AnimalBreed, src => src.Animal.Breed)
                )
                .ForMember(
                    dest => dest.Status,
                    opt => opt.MapFrom(src => DetermineReservationStatus(src))
                );
            
            CreateMap<ReservationForUpdateDto, Reservation>()
                .MapMembers(
                    (dst => dst.StartDate, src => src.Date.Date + src.StartTime),
                    (dst => dst.EndDate, src => src.Date.Date + src.EndTime),
                    (dst => dst.IsEnded, src => src.IsEnded),
                    (dst => dst.isReserved, src => src.IsReserved),
                    (dst => dst.isAproved, src => src.IsApproved)
                )
                .Ignore(
                    dst => dst.Id,
                    dst => dst.VolunteerId,
                    dst => dst.AnimalId
                );
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
