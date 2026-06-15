from passlib.context import CryptContext


pwd_context = CryptContext(schemes=['bcrypt'], deprecated="auto")

def get_password_hash(password: str) -> str:
    '''Create hash password'''
    return pwd_context.hash(password)

def verifity_password(password: str, hashed_password: str) -> bool:
    '''Check password'''
    return pwd_context.verify(password, hashed_password)