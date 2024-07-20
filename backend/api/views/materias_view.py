from ..models import Materias, Estudiantes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers import MateriasSerializer, EstudiantesSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import generics

class MateriasView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, id = None):
        if id is not None:
            instance = Materias.objects.get(id = id)
            serializer = MateriasSerializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = MateriasSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "New subject created"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, id = None):
        if id is not None:
            instance = Materias.objects.get(id=id)
            update = {}
            for key, value in request.data.items():
                if value != "":
                    update[key] = value
            serializer = MateriasSerializer(instance, data=update, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "ID no valido"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id = None):
        if id is not None:
            instance = Materias.objects.filter(id = id)
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "ID no valido"}, status=status.HTTP_400_BAD_REQUEST)
        
class StudentsClassList(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Estudiantes.objects.all()
    serializer_class = EstudiantesSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned articles to given regions,
        by filtering against a `regions` query parameter in the URL.
        """
        clase = self.request.query_params.get("clase", None)
        if clase:
            qs = Estudiantes.objects.filter()
            qs = qs.filter(clase = clase)
            return qs
        return super().get_queryset()
    
    
class MateriasbyDocentList(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Materias.objects.all()
    serializer_class = MateriasSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned articles to given regions,
        by filtering against a `regions` query parameter in the URL.
        """
        docent = self.request.query_params.get("docent", None)
        if docent:
            qs = Materias.objects.filter()
            qs = qs.filter(docent = docent)
            return qs
        return super().get_queryset()
    
    
class MateriasCountView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        if id is not None:
            Counts = {}
            Counts["M"] = Materias.objects.filter(name = "Matematicas").count()
            Counts["H"] = Materias.objects.filter(name = "Historia").count()
            Counts["B"] = Materias.objects.filter(name = "Biologia").count()
            Counts["G"] = Materias.objects.filter(name = "Geografia").count()
            return Response({"count": Counts}, status=status.HTTP_200_OK)