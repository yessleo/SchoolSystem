from rest_framework import generics
from ..serializers import GradoSerializer, ClaseSerializer
from ..models import Grado, Clase


class GeneralListApiView(generics.ListAPIView):
    serializer_class = None
    def get_queryset(self):
        model = self.get_serializer().Meta.model
        return model.objects.filter()
    
    
class ClaseListAPIView(GeneralListApiView):
    serializer_class = GradoSerializer

    
class GradosListAPIView(GeneralListApiView):
    serializer_class = GradoSerializer


