from ..models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers import UserCreationSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


class UsersView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk = None):
        id = pk
        if id is not None:
            instance = User.objects.get(id = id)
            serializer = UserSerializer(instance)
            return Response({"data": serializer.data}, status=status.HTTP_200_OK)
        else:

            instance = User.objects.all()
            serializer = UserSerializer(instance, many = True)
            return Response({"data": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = UserCreationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "user created"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk = None):
        user = User.objects.get(pk=pk)
        print(user)
        if pk is not None:
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"data": serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "ID no valido"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk = None):
        if pk is not None:
            user = User.objects.filter(pk = pk)
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "ID no valido"}, status=status.HTTP_400_BAD_REQUEST)