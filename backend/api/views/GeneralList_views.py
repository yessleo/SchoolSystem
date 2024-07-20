from rest_framework import generics
from ..serializers import GradoSerializer, ClaseSerializer, MateriasSerializer, NotasSerializer
from ..models import Grado, Clase, Materias


class GeneralListApiView(generics.ListAPIView):
    serializer_class = None
    def get_queryset(self):
        model = self.get_serializer().Meta.model
        return model.objects.filter()
    
class ClasesListAPIView(GeneralListApiView):
    serializer_class = ClaseSerializer
    
class GradosListAPIView(GeneralListApiView):
    serializer_class = GradoSerializer
    
class MateriasListAPIView(GeneralListApiView):
    serializer_class = MateriasSerializer
    
class NotasListAPIView(GeneralListApiView):
    serializer_class = NotasSerializer




