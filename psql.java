import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class PostgreSQLExample {
    // JDBC URL, username, and password of PostgreSQL server
    private static final String URL = "jdbc:postgresql://localhost:5432/Kursach";
    private static final String USER = "postgres";
    private static final String PASSWORD = "842308nmsd";

    // Load the PostgreSQL JDBC driver
    static {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    // JDBC variables for opening, closing and managing connection
    private static Connection connection;

    public static void main(String[] args) {
        try {
            // Open a connection
            connection = DriverManager.getConnection(URL, USER, PASSWORD);

            // Execute a query
            String sqlQuery = "SELECT * FROM ваша_таблица";
            try (PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery);
                 ResultSet resultSet = preparedStatement.executeQuery()) {

                // Process the results
                while (resultSet.next()) {
                    int id = resultSet.getInt("id");
                    String name = resultSet.getString("name");
                    // Продолжайте извлекать другие поля по аналогии

                    System.out.println("ID: " + id + ", Name: " + name);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            // Close the connection
            try {
                if (connection != null && !connection.isClosed()) {
                    connection.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
