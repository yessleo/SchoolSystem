from ..models import Notas, Estudiantes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers import NotasSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import generics

class NotasView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, id = None):
        if id is not None:
            instance = Notas.objects.get(estudiante = id)
            serializer = NotasSerializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = NotasSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "New subject created"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, id = None):
        if id is not None:
            instance = Notas.objects.get(id=id)
            update = {}
            print(request.data)
            for key, value in request.data.items():
                if value != "":
                    update[key] = value
            print(update)
            serializer = NotasSerializer(instance, data=update, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "ID no valido"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id = None):
        if id is not None:
            instance = Notas.objects.filter(id = id)
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "ID no valido"}, status=status.HTTP_400_BAD_REQUEST)
        

class NotasStudentList(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Notas.objects.all()
    serializer_class = NotasSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned articles to given regions,
        by filtering against a `regions` query parameter in the URL.
        """
        student = self.request.query_params.get("student", None)
        if student:
            qs = Notas.objects.filter()
            qs = qs.filter(estudiante = student)
            return qs
        return super().get_queryset()
    
    
class NotasMateriaList(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Notas.objects.all()
    serializer_class = NotasSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned articles to given regions,
        by filtering against a `regions` query parameter in the URL.
        """
        materia = self.request.query_params.get("materia", None)
        if materia:
            qs = Notas.objects.filter()
            qs = qs.filter(materia = materia)
            return qs
        return super().get_queryset()