import random
from django.core.mail import send_mail
from .models import User, OneTimePassword
from backend.settings import EMAIL_HOST_USER


def generateOtp():
    otp = ""
    for i in range(6):
        otp +=str(random.randint(1,9))
    return otp


def send_code_to_user(email):
    Subject = "One time passcode for Email verification"
    otp_code=generateOtp()
    user = User.Objects.get(email = email)
    curent_site = "myAuth.com"
    email_body=f"Thanks for verifying your {user.username} account!\nYour code is {otp_code}"
    from_email = "yessell.leon@gmail.com"
    
    OneTimePassword.objects.create(user = user, code = otp_code)
    send_mail (subject=Subject, body=email_body, from_email=from_email, to=[email])

    
    
def send_normal_email(data):
    send_mail(
        data['email_subject'],
        data['email_body'],
        EMAIL_HOST_USER,
        [data['to_email']],
        fail_silently=True
    )
