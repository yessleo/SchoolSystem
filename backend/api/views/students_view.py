from ..models import Estudiantes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers import EstudiantesSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


class DocentView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        instance = Estudiantes.objects.all()
        serializer = EstudiantesSerializer(instance, many = True)
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = EstudiantesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "New student created"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
        
class Docents_detail_view(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk = None):
        if pk is not None:
            instance = Estudiantes.objects.get(pk = pk)
            serializer = EstudiantesSerializer(instance)
            return Response({"data": serializer.data}, status=status.HTTP_200_OK)


    def patch(self, request, pk = None):
        if pk is not None:
            student = Estudiantes.objects.get(pk=pk)
            serializer = EstudiantesSerializer(student, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"data": serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "ID no valido"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk = None):
        if pk is not None:
            student = Estudiantes.objects.filter(pk = pk)
            student.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "ID no valido"}, status=status.HTTP_400_BAD_REQUEST)