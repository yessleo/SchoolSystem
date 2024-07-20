from ..models import Clase, Grado
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers import ClaseSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import generics

class ClasesView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, id = None):
        if id is not None:
            instance = Clase.objects.get(id = id)
            serializer = ClaseSerializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ClaseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "New class created"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, id = None):
        if id is not None:
            instance = Clase.objects.get(id=id)
            update = {}
            for key, value in request.data.items():
                if value != "":
                    update[key] = value
            serializer = ClaseSerializer(instance, data=update, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "ID no valido"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id = None):
        if id is not None:
            clase = Clase.objects.filter(id = id)
            clase.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "ID no valido"}, status=status.HTTP_400_BAD_REQUEST)
        
        
class ClasesbyGradoList(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Clase.objects.all()
    serializer_class = ClaseSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned articles to given regions,
        by filtering against a `regions` query parameter in the URL.
        """
        grado = self.request.query_params.get("grado", None)
        if grado:
            qs = Clase.objects.filter()
            qs = qs.filter(grado = grado)
            return qs

        return super().get_queryset()