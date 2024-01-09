
class StandardException(Exception):
    def __init__(self, message: str, *args: object):
        super().__init__(args)
        self.message = message

    def __str__(self):
        return str(self.message)


class InvalidFieldsException(StandardException):
    pass
