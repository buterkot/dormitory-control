-- Создание таблицы history (если её нет)
CREATE TABLE IF NOT EXISTS history (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(255),
    operation_name VARCHAR(255),
    operation_description VARCHAR(255),
    operation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание функции для триггера
CREATE OR REPLACE FUNCTION history_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO history (table_name, operation_name, operation_description)
        VALUES (TG_TABLE_NAME, 'INSERT', 'Запись была вставлена');
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO history (table_name, operation_name, operation_description)
        VALUES (TG_TABLE_NAME, 'UPDATE', 'Запись была обновлена');
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO history (table_name, operation_name, operation_description)
        VALUES (TG_TABLE_NAME, 'DELETE', 'Запись была удалена');
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_change_trigger 
AFTER INSERT OR UPDATE OR DELETE ON applications
FOR EACH ROW
EXECUTE FUNCTION history_trigger_function();

CREATE TRIGGER after_change_trigger 
AFTER INSERT OR UPDATE OR DELETE ON public.employees
FOR EACH ROW
EXECUTE FUNCTION history_trigger_function();

CREATE TRIGGER after_change_trigger 
AFTER INSERT OR UPDATE OR DELETE ON public.floor_duty
FOR EACH ROW
EXECUTE FUNCTION history_trigger_function();

CREATE TRIGGER after_change_trigger 
AFTER INSERT OR UPDATE OR DELETE ON public.furniture
FOR EACH ROW
EXECUTE FUNCTION history_trigger_function();

CREATE TRIGGER after_change_trigger 
AFTER INSERT OR UPDATE OR DELETE ON public.headmen
FOR EACH ROW
EXECUTE FUNCTION history_trigger_function();

CREATE TRIGGER after_change_trigger 
AFTER INSERT OR UPDATE OR DELETE ON public.repair
FOR EACH ROW
EXECUTE FUNCTION history_trigger_function();

CREATE TRIGGER after_change_trigger 
AFTER INSERT OR UPDATE OR DELETE ON public.reprimands
FOR EACH ROW
EXECUTE FUNCTION history_trigger_function();

CREATE TRIGGER after_change_trigger 
AFTER INSERT OR UPDATE OR DELETE ON public.residents
FOR EACH ROW
EXECUTE FUNCTION history_trigger_function();

CREATE TRIGGER after_change_trigger 
AFTER INSERT OR UPDATE OR DELETE ON public.rooms
FOR EACH ROW
EXECUTE FUNCTION history_trigger_function();

CREATE TRIGGER after_change_trigger 
AFTER INSERT OR UPDATE OR DELETE ON public.student_council
FOR EACH ROW
EXECUTE FUNCTION history_trigger_function();

CREATE TRIGGER after_change_trigger 
AFTER INSERT OR UPDATE OR DELETE ON public.suw
FOR EACH ROW
EXECUTE FUNCTION history_trigger_function();

select * from history;