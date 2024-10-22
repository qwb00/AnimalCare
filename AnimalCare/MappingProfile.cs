using Models.Entities;
using AutoMapper;
using Shared.DataTransferObjects;
using AnimalCare.Extensions;
using Shared.DataTransferObjects.AnimalsDTO;
using Shared.DataTransferObjects.UsersDTO;

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

            CreateMap<User, UserListDTO>().MapMembers(
                (dst => dst.Name, src => src.FullName)
                );
            CreateMap<User, UserDetailDTO>().MapMembers(
                (dst => dst.Name, src => src.FullName)
                );


            CreateMap<Volunteer, VolunteerListDTO>().MapMembers(
                (dst => dst.Name, src => src.FullName)
                );

            CreateMap<Volunteer, ChangeStatusForVolunteerDTO>();

            CreateMap<ChangeStatusForVolunteerDTO, Volunteer>().MapMembers(
                (dest => dest.IsVerified, src => src.IsVerified)
                );


            CreateMap<Reservation, ReservationForVolunteerShow>();

            CreateMap<ExaminationRecord, ExaminationRecordForCaretaker>();
        }
    }
}
