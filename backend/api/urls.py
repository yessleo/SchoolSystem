from django.urls import path
from .views.views import LoginUserView, TestAuthenticationView, PasswordResetConfirm, \
    PasswordResetRequestView, SetNewPassword
    
from .views.user_views import UsersView
from .views.docents_views import DocentView, Docents_detail_view
from .views.GeneralList_views import ClaseListAPIView, GradosListAPIView


urlpatterns = [
    path('login/', LoginUserView.as_view(), name = 'login'),
    path('home/', TestAuthenticationView.as_view(), name = 'home'),
    path('password-reset/', PasswordResetRequestView.as_view(), name = 'password-reset'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirm.as_view(), name = 'password-reset-confirm'),
    path('set-new-password/', SetNewPassword.as_view(), name = 'set-new-password'),
    path('users/', UsersView.as_view(), name='users-list'),
    path('users/<int:pk>/', UsersView.as_view(), name='users-detail'),
    path('docents/', DocentView.as_view(), name='docents-list'),
    path('docents/<int:pk>/', Docents_detail_view.as_view(), name='docents-detail'),
    path('clases/', ClaseListAPIView.as_view(), name='clases'),
    path('grados/', GradosListAPIView.as_view(), name='grados'),
]
