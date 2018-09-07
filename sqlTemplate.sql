DROP_EXISTING registration_numbers;

create table towns(
	id serial not null primary key,
	town_name varchar(100) not null,
    initials varchar(5) not null
);

create table registration_numbers (
	id serial not null primary key,
    plates varchar(12) not null,
	towns_id int,
	status varchar(50) ,
	foreign key (towns_id) references towns(id)
);
