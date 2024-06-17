const db = require('../db')
const bcrypt = require('bcryptjs');

const saltRounds = 10;

class UserController {
    async createUser(req, res) {
        const { login, password } = req.body
        console.log(login, password)
        const newUser = await db.query(`insert into users (login, password) values ($1, $2) returning *`, [login, password])

        res.json(newUser.rows[0])
    }
    async getUsers(req, res) {
        const users = await db.query(`select * from users`)
        res.json(users.rows)
    }
    async getOneUser(req, res) {
        const id = req.params.id
        const user = await db.query(`select * from users where id = $1`, [id])
        res.json(user.rows[0])
    }

    async updateUser(req, res) {
        const { id, login, password } = req.body
        const user = await db.query(`update users set login = $1, password = $2 where id = $3 returning *`, [login, password, id])
        res.json(user.rows[0])
    }
    async deleteUser(req, res) {
        const id = req.params.id
        const user = await db.query(`delete from users where id = $1`, [id])
        res.json(user.rows[0])
    }

    async registerUser(req, res) {
        const { login, password } = req.body;

        try {

            const existingUser = await db.query('SELECT * FROM users WHERE login = $1', [login]);

            if (existingUser.rows.length > 0) {
                return res.status(400).json({ error: 'Пользователь с таким логином уже существует' });
            }
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = await db.query(`INSERT INTO users (login, password) VALUES ($1, $2) RETURNING *`, [login, hashedPassword]);

            const userId = newUser.rows[0].id;

            const newEmployee = await db.query(
                'INSERT INTO employees (name, title, phone_number, address, salary, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [null, null, null, null, null, userId]
            );

            res.status(201).json({ user: newUser.rows[0], employee: newEmployee.rows[0] });
        } catch (error) {
            console.error('Ошибка при регистрации:', error.message);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }

    async loginUser(req, res) {
        const { login, password } = req.body;

        try {

            const user = await db.query('SELECT * FROM users WHERE login = $1', [login]);

            if (user.rows.length === 0) {
                return res.status(401).json({ message: 'Неверные учетные данные' });
            }

            const hashedPassword = user.rows[0].password;

            const passwordMatch = await bcrypt.compare(password, hashedPassword);

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Неверные учетные данные' });
            }

            res.json({ message: 'Успешная авторизация' });
        } catch (error) {
            console.error('Ошибка при авторизации:', error);
            res.status(500).json({ message: 'Внутренняя ошибка сервера' });
        }
    }

    async OneUserInfo(req, res) {
        try {
            const login = req.query.userLogin;
            const user = await db.query(`
                SELECT name, title, phone_number, address, salary 
                FROM employees
                JOIN users ON employees.user_id = users.id
                WHERE users.login = $1;
            `, [login]);

            if (user.rows.length === 0) {
                return res.status(404).json({ error: "Пользователь не найден" });
            }

            res.json(user.rows[0]);
        } catch (error) {
            console.error("Ошибка при запросе пользователя:", error);
            res.status(500).json({ error: "Внутренняя ошибка сервера" });
        }
    }

    async updateOPT(req, res) {
        const { fio, month, hoursOPT } = req.body;
        try {
            const updatedOPT = await db.query(`UPDATE suw
            SET ${month} = $1
            FROM residents
            WHERE suw.suw_id = residents.suw_id
            AND residents.name = $2;`, [hoursOPT, fio]);
            res.json({ success: true, message: 'Данные ОПТ успешно обновлены' });
        } catch (error) {
            console.error('Ошибка при обновлении данных ОПТ:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }

    async banUser(req, res) {
        const { id } = req.body;
        try {
            const banedUser = await db.query(`UPDATE users
            SET user_role = 'ban'
            WHERE users.id = $1;`, [id]);
            res.json({ success: true, message: 'Пользователь успешно забанен' });
        } catch (error) {
            console.error('Ошибка при бане пользователя:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }

    async unbanUser(req, res) {
        const { id } = req.body;
        try {
            const banedUser = await db.query(`UPDATE users
            SET user_role = 'default'
            WHERE users.id = $1;`, [id]);
            res.json({ success: true, message: 'Пользователь успешно разбанен' });
        } catch (error) {
            console.error('Ошибка при разбане пользователя:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }

    async deleteUser(req, res) {
        const { id } = req.body;
        try {
            const deletedUser = await db.query(`delete from users
            WHERE users.id = $1;`, [id]);
            res.json({ success: true, message: 'Пользователь успешно удалён' });
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }

    async getTableContent(req, res) {
        try {
            const tableName = req.params.tableName;
            let query;
            switch (tableName) {
                case 'residents':
                    query = `select name, phone_number, registration, room_id, counter, hours from residents
                    join suw on residents.suw_id = suw.suw_id
                    join floor_duty on residents.duty_id = floor_duty.duty_id;`;
                    break;
                case `history`:
                    query = `select id, table_name, operation_name, operation_date from history;`;
                    break;
                case `users`:
                    query = `select users.id, users.login, employees.name, user_role from users join employees on users.id = employees.user_id;`;
                    break;
                case `rooms`:
                    query = `SELECT rooms.room_id, rooms.status,
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
                    ) AS furniture_counts ON rooms.room_id = furniture_counts.room_id;`;
                    break;
                case `suw`:
                    query = `select residents.name, september, october, november, december,
                    january, february, march, april, may, june, hours from suw
                    join residents on residents.suw_id = suw.suw_id;`;
                    break;
                case 'floor_duty':
                    query = `select residents.name, september, october, november, december,
                    january, february, march, april, may, june, counter from floor_duty
                    join residents on residents.duty_id = floor_duty.duty_id;`;
                    break;
                case 'applications':
                    query = `select residents.name, status, application_date, check_in_date, room from residents
                    join applications on residents.application_id = applications.application_id;`;
                    break;
                case 'reprimands':
                    query = `select residents.name as name1, employees.name as name2, note, status from reprimands
                    join residents on residents.resident_id = reprimands.resident_id
                    join employees on employees.employee_id = reprimands.employee_id;`;
                    break;
                case 'repair':
                    query = `select residents.name as name1, employees.name as name2, note, status, repair.room_id from repair
                    join residents on residents.resident_id = repair.resident_id
                    join employees on employees.employee_id = repair.employee_id;`;
                    break;
                default:
                    query = `SELECT * FROM ${tableName}`;
                    break;
            }
            const tableContent = await db.query(query);
            res.json(tableContent.rows);
            console.log('Запрос произошёл');
        } catch (error) {
            console.error('Ошибка при получении содержимого таблицы:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }

    async importData(req, res) {
        const { data } = req.body;
        console.log('Received data:', data);
        try {
            const updateQuery = `
                UPDATE floor_duty
                SET
                    september = $1,
                    october = $2,
                    november = $3,
                    december = $4,
                    january = $5,
                    february = $6,
                    march = $7,
                    april = $8,
                    may = $9,
                    june = $10
                    from residents
                WHERE floor_duty.duty_id = residents.duty_id and residents.name = $11;
            `;

            for (const dataItem of data) {
                const updateValues = [
                    dataItem.september,
                    dataItem.october,
                    dataItem.november,
                    dataItem.december,
                    dataItem.january,
                    dataItem.february,
                    dataItem.march,
                    dataItem.april,
                    dataItem.may,
                    dataItem.june,
                    dataItem.name,  // Используйте dataItem.name в качестве последнего параметра
                ];

                console.log('Executing SQL Query:', updateQuery);
                console.log('Query Parameters:', updateValues);

                const result = await db.query(updateQuery, updateValues);

                console.log('Query Result:', result);
            }

            res.json({ success: true, message: 'Данные успешно импортированы' });
        } catch (error) {
            console.error('Ошибка при импорте данных:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }

    async updateUser(req, res) {
        const login = req.query.userLogin;
        const { name, title, phone_number, address, salary } = req.body;

        try {
            const updatedUser = await db.query(`
            UPDATE employees
            SET name = $1, title = $2, phone_number = $3, address = $5, salary = $6
            FROM users
            WHERE employees.user_id = users.id AND users.login = $4
            RETURNING *;
          `, [name, title, phone_number, login, address, salary]);

            if (updatedUser.rows.length === 0) {
                return res.status(404).json({ error: "Пользователь не найден" });
            }
            res.json(updatedUser.rows[0]);
        } catch (error) {
            console.error('Ошибка при обновлении данных пользователя:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }

    async getUserRole(req, res) {
        try {
            const login = req.params.login;

            const user = await db.query('SELECT * FROM users WHERE login = $1', [login]);

            if (user.rows.length === 0) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }

            res.json({ role: user.rows[0].user_role });
        } catch (error) {
            console.error('Error getting user role:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }

}

module.exports = new UserController()