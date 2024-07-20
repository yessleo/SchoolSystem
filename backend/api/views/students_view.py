from ..models import Estudiantes, User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers import EstudiantesSerializer, ClaseSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication


class StudentView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        instance = Estudiantes.objects.all()
        serializer = EstudiantesSerializer(instance, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = EstudiantesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "New student created"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
        
class Students_detail_view(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, id = None):
        if id is not None:
            instance = Estudiantes.objects.get(id = id)
            serializer = EstudiantesSerializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)


    def patch(self, request, id = None):
        if id is not None:
            student = Estudiantes.objects.get(id=id)
            update = {}
            for key, value in request.data.items():
                if value != "":
                    update[key] = value
                    
            serializer = EstudiantesSerializer(student, data=update, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "ID no valido"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id = None):
        if id is not None:
            instance = Estudiantes.objects.get(id = id)
            serializer = EstudiantesSerializer(instance)
            currentUser = serializer.data["user"]["id"]
            user = User.objects.get(id = currentUser)
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "ID no valido"}, status=status.HTTP_400_BAD_REQUEST)
        

class StudentsbyClassView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, id = None):
        if id is not None:
            count = Estudiantes.objects.filter(clase = id).count()
            return Response({"count": count}, status=status.HTTP_200_OK)