from backend.settings import MIN_PASSWORD_LENGTH

# LOGIN FORM
MISSING_LOGIN_PASSWORD_MESSAGE = "Введите имя пользователя и пароль!"
WRONG_LOGIN_PASSWORD_MESSAGE = "Неверный пароль или имя пользователя!"
UNEXPECTED_ERROR_MESSAGE = "Произошла непредвиденная ошибка!"

# CREATING USER FORM
USER_EXISTS_MESSAGE = "Пользователь с таким логином уже существует!"
PASSWORD_TOO_SHORT_MESSAGE = f"Минимальная длина пароля {MIN_PASSWORD_LENGTH} символов!"

# AUTH AND ADMIN
UNKNOWN_TOKEN_MESSAGE = "Недействительный токен сессии!\nВойдите чтобы продолжить работу."
TOKEN_EXPIRED_MESSAGE = "Истек срок действия сессии!\nВойдите чтобы продолжить работу."
AUTH_ERROR_MESSAGE = "Не получилось верифицировать пользователя!\nВойдите чтобы продолжить работу."
REQUIRES_ADMIN_PRIVILEGE_MESSAGE = "Для совершения данного действия необходимо разрешение администратора!"

# DELETE USER
USER_DOES_NOT_EXIST_MESSAGE = "Пользователь не найден!"

# EDIT USER
EDITING_FOREIGN_USER = "Редактирование данных чужого пользователя запрещено!"
