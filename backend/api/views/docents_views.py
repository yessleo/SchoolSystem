from ..models import Docentes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers import UserCreationSerializer, UserSerializer, DocentesSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


class DocentView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        instance = Docentes.objects.all()
        serializer = DocentesSerializer(instance, many = True)
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = DocentesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "New docent created"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
        
class Docents_detail_view(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk = None):
        if pk is not None:
            instance = Docentes.objects.get(pk = pk)
            serializer = DocentesSerializer(instance)
            return Response({"data": serializer.data}, status=status.HTTP_200_OK)


    def patch(self, request, pk = None):
        if pk is not None:
            empl = Docentes.objects.get(pk=pk)
            serializer = DocentesSerializer(empl, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"data": serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "ID no valido"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk = None):
        if pk is not None:
            empl = Docentes.objects.filter(pk = pk)
            empl.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "ID no valido"}, status=status.HTTP_400_BAD_REQUEST)