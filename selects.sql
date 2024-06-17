SELECT rooms.room_id, rooms.status,
    COALESCE(residents_count, 0) AS residents_count,
    COALESCE(furniture_count, 0) AS furniture_count
FROM rooms
LEFT JOIN (
    SELECT room_id, COUNT(resident_id) AS residents_count
    FROM residents
    GROUP BY room_id
) AS residents_counts ON rooms.room_id = residents_counts.room_id
LEFT JOIN (
    SELECT room_id, COUNT(furniture_id) AS furniture_count
    FROM furniture
    GROUP BY room_id
) AS furniture_counts ON rooms.room_id = furniture_counts.room_id;


select rooms.room_id, rooms.status, 
count(resident_id)::int as residents_count,
count(furniture_id)::int as furniture_count 
from rooms
left join residents on rooms.room_id = residents.room_id
left join furniture on rooms.room_id = furniture.room_id
group by rooms.room_id;

select * from rooms;

select name, phone_number, registration, room_id, counter, hours from residents
join suw on residents.suw_id = suw.suw_id
join floor_duty on residents.duty_id = floor_duty.duty_id;

select users.id, users.login, employees.name, user_role from users
join employees on users.id = employees.user_id;

select residents.name, september, october, november, december,
january, february, march, april, may, june, hours from suw
join residents on residents.suw_id = suw.suw_id;

select residents.name, september, october, november, december,
january, february, march, april, may, june, counter from floor_duty
join residents on residents.duty_id = floor_duty.duty_id;

select residents.name, status, application_date, check_in_date, room from residents
join applications on residents.application_id = applications.application_id;

select residents.name, employees.name, note, status from reprimands
join residents on residents.resident_id = reprimands.resident_id
join employees on employees.employee_id = reprimands.employee_id;

select residents.name, employees.name, note, status, repair.room_id from repair
join residents on residents.resident_id = repair.resident_id
join employees on employees.employee_id = repair.employee_id;

select * from employees;
select * from furniture;
select * from history;