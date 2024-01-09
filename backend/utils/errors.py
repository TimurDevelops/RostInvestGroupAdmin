
class StandardException(Exception):
    def __init__(self, *args: object):
        super().__init__(args)
        self.message = None

    def __str__(self):
        return str(self.message)


class LoginException(StandardException):
    def __init__(self, message: str):
        self.message = message
