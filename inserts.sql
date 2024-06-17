insert into employees (name, title, phone_number, address, salary)
values ('Борисюк Роман Александрович', 'Сантехник', '+375292126713', 'Минск', 1000);

insert into residents (name, phone_number, registration, application_id, room_id, duty_id, suw_id)
values ('Рей Аянами Синдзиковна', '+349869386398', 'Токио', 9, 2, 5, 5);
select * from residents;

insert into applications (status, application_date, check_in_date, room)
values ('К заселению', '2023-06-02', '2023-07-19', 2);
select * from applications;

insert into rooms
values (5, 'active');
select * from rooms;

insert into floor_duty (reprimands, september, october, november, december, january, february, march, april, may, june)
values ('-', 0, 0, 0, 1, 3, 2, 1, 1, 0, 2);
select * from floor_duty;

insert into suw (september, october, november, december, january, february, march, april, may, june)
values (2, 4, 0, 12, 12, 0, 0, 0, 0, 4);
select * from suw;

UPDATE suw SET september = 1
FROM residents
WHERE suw.suw_id = residents.suw_id
AND residents.name = 'Михейка Никита Максимович';

select * from users;

insert into furniture (name, status, room_id)
values ('Кровать', 'Норма', 2);

insert into repair (note, status, resident_id, employee_id, room_id)
values ('Сломан унитаз', 'Устранено', 2, 2, 1);

insert into reprimands (note, status, resident_id, employee_id)
values ('Курение', 'Снят', 4, 1);

insert into student_council (resident_id, sector)
values (2, 'Информ');

insert into headmen (resident_id, floor)
values (2, 14);

update rooms
set residents_count = 0
where status = 'repair';

select * from residents;