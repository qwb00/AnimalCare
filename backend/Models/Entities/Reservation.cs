﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Shared.Enums;

namespace Models.Entities
{
    public class Reservation : BaseEntity
    {
        [DataType(DataType.DateTime)]
        public DateTime StartDate { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime EndDate { get; set; }
        public ReservationStatus Status { get; set; }
     
        [Required]
        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        [JsonIgnore]
        public User User { get; set; }

        [Required]
        public Guid AnimalId { get; set; }
        [ForeignKey("AnimalId")]
        [JsonIgnore]
        public Animal Animal { get; set; }
    }
}
