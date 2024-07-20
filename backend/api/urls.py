from django.urls import path
from .views.views import PasswordResetConfirm, \
    PasswordResetRequestView, SetNewPassword
    
from .views.user_views import UsersView, UsersCountView, UpdateUserView
from .views.docents_views import DocentView, Docents_detail_view
from .views.GeneralList_views import ClasesListAPIView, GradosListAPIView, MateriasListAPIView, NotasListAPIView
from .views.clases_view import ClasesView, ClasesbyGradoList
from .views.students_view import StudentView, Students_detail_view, StudentsbyClassView
from .views.profile_user_view import MyTokenObtainPairView, ProfileView, LogoutView
from .views.materias_view import MateriasView, StudentsClassList, MateriasbyDocentList, MateriasCountView
from .views.notas_view import NotasView, NotasStudentList, NotasMateriaList
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView


urlpatterns = [
    path('auth/sign-in', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/logout', LogoutView.as_view(), name='logout'),
    path('token/refresh', TokenRefreshView.as_view()),
    path('token/verify', TokenVerifyView.as_view()),
    path('auth/me', ProfileView.as_view(), name = 'me'),
    path('password-reset', PasswordResetRequestView.as_view(), name = 'password-reset'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirm.as_view(), name = 'password-reset-confirm'),
    path('set-new-password', SetNewPassword.as_view(), name = 'set-new-password'),
    
    path('users', UsersView.as_view(), name='users-list'),
    path('users/<int:id>', UsersView.as_view(), name='users-details'),
    path('user-update/<int:pk>', UpdateUserView.as_view(), name='users-update'),
    path('users-count/<str:role>', UsersCountView.as_view(), name='users-count'),
    
    path('docents', DocentView.as_view(), name='docents-list'),
    path('docents-details/<int:id>', Docents_detail_view.as_view(), name='docents-detail'),
    
    path('students', StudentView.as_view(), name='students-list'),
    path('students-details/<int:id>', Students_detail_view.as_view(), name='students-detail'),
    
    path('clases-list', ClasesListAPIView.as_view(), name='clases'),
    path('grado-clases', ClasesbyGradoList.as_view(), name='clases-by-grado'),
    path('grados', GradosListAPIView.as_view(), name='grados'),
    path('clases', ClasesView.as_view(), name='clase'),
    path('students-count/<int:id>', StudentsbyClassView.as_view(), name='students-count'),
    path('clases-actions/<int:id>', ClasesView.as_view(), name='clases-detail'),
    
    path('materias-list', MateriasListAPIView.as_view(), name='materias-list'),
    path('students-list', StudentsClassList.as_view(), name='students-list'),
    path('materias-docent', MateriasbyDocentList.as_view(), name='materias--docent-list'),
    path('materias', MateriasView.as_view(), name='materias'),
    path('materias-count', MateriasCountView.as_view(), name='materias-count'),
    path('materias-actions/<int:id>', MateriasView.as_view(), name='materias-details'),
    
    path('notas-list', NotasListAPIView.as_view(), name='notas-list'),
    path('notas', NotasView.as_view(), name='notas'),
    path('notas-student', NotasStudentList.as_view(), name='notas-student'),
    path('notas-materia', NotasMateriaList.as_view(), name='notas-materia'),
    path('notas-actions/<int:id>', NotasView.as_view(), name='notas-details'),
]
