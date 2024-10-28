using Models.Entities;
using AutoMapper;
using Shared.DataTransferObjects;
using AnimalCare.Extensions;
using Shared.DataTransferObjects.AnimalsDTO;
using Shared.DataTransferObjects.UsersDTO;
using Shared.DataTransferObjects.ExaminationRecordsDTO;
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
            CreateMap<Animal, AnimalForUpdateDTO>().ReverseMap();
            CreateMap<AnimalForCreating, Animal>();

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
                    (dst => dst.Date, src => src.StartDate.Date),
                    (dst => dst.StartTime, src => src.StartDate.TimeOfDay),
                    (dst => dst.EndTime, src => src.EndDate.TimeOfDay)
                )
                .ForMember(
                    dest => dest.Status,
                    opt => opt.MapFrom(src => DetermineReservationStatus(src))
                );

            CreateMap<Reservation, ReservationForUpdateDto>()
                .MapMembers(
                    (dst => dst.Date, src => src.StartDate.Date),
                    (dst => dst.StartTime, src => src.StartDate.TimeOfDay),
                    (dst => dst.EndTime, src => src.EndDate.TimeOfDay)
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

            CreateMap<User, UserListDTO>().MapMembers(
                (dst => dst.Name, src => src.FullName)
                );
            CreateMap<User, UserDetailDTO>().MapMembers(
                (dst => dst.Name, src => src.FullName)
                );
            CreateMap<UserForCreateDTO, User>().MapMembers(
                (dest => dest.FullName, src => $"{src.FirstName} {src.LastName}".Trim())
            ).Include<UserForCreateDTO, Volunteer>();

            CreateMap<UserForUpdateDTO, User>().MapMembers(
                (dest => dest.FullName, src => $"{src.FirstName} {src.LastName}".Trim())
            );

            CreateMap<Volunteer, UserForCreateDTO>().ReverseMap();

            CreateMap<Volunteer, VolunteerListDTO>().MapMembers(
                (dst => dst.Name, src => src.FullName)
                );

            CreateMap<Volunteer, ChangeStatusForVolunteerDTO>();

            CreateMap<ChangeStatusForVolunteerDTO, Volunteer>().MapMembers(
                (dest => dest.IsVerified, src => src.IsVerified)
                );

            CreateMap<ExaminationRecordForCreationDto, ExaminationRecord>()
                .MapMembers(
                    (dst => dst.Date, src => src.ExaminationDate),
                    (dst => dst.Type, src => src.Type),
                    (dst => dst.Description, src => src.Description),
                    (dst => dst.AnimalId, src => src.AnimalId),
                    (dst => dst.VeterinarianId, src => src.VeterinarianId),
                    (dst => dst.CareTakerId, src => src.CareTakerId)
                )
                .UseValue(dst => dst.Status, ExaminationStatus.InProgress)
                .UseValue( dst => dst.FinalDiagnosis, "Not specified")
                .Ignore(
                    dst => dst.Id
                );
            
            CreateMap<ExaminationRecordForUpdateDto, ExaminationRecord>()
                .MapMembers(
                    (dst => dst.Status, src => src.Status),
                    (dst => dst.FinalDiagnosis, src => src.FinalDiagnosis)
                )
                .Ignore(
                    dst => dst.Id,
                    dst => dst.AnimalId,
                    dst => dst.VeterinarianId,
                    dst => dst.Type,
                    dst => dst.Date,
                    dst => dst.Description
                );

            CreateMap<ExaminationRecord, ExaminationRecordForUpdateDto>();

            CreateMap<ExaminationRecord, ExaminationRecordDto>()
                .MapMembers(
                    (dst => dst.Id, src => src.Id),
                    (dst => dst.AnimalName, src => src.Animal.Name),
                    (dst => dst.AnimalBreed, src => src.Animal.Breed),
                    (dst => dst.VeterinarianName, src => src.Veterinarian.FullName),
                    (dst => dst.AnimalPhoto, src => src.Animal.Photo),
                    (dst => dst.Type, src => src.Type),
                    (dst => dst.Status, src => src.Status),
                    (dst => dst.ExaminationDate, src => src.Date),
                    (dst => dst.Description, src => src.Description),
                    (dst => dst.FinalDiagnosis, src => src.FinalDiagnosis)
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
                return ReservationStatus.UPCOMING;
        }
    }
}
