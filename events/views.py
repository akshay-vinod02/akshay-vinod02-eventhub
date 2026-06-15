from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Event, Registration
from .serializers import EventSerializer, RegistrationSerializer

class EventListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        search = request.query_params.get('search', '')
        events = Event.objects.all().order_by('-created_at')
        if search:
            events = events.filter(title__icontains=search)
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

class EventDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            event = Event.objects.get(pk=pk)
            serializer = EventSerializer(event)
            return Response(serializer.data)
        except Event.DoesNotExist:
            return Response(
                {'error': 'Event not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class EventRegisterView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            event = Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return Response(
                {'error': 'Event not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        if Registration.objects.filter(user=request.user, event=event).exists():
            return Response(
                {'error': 'You have already registered for this event'},
                status=status.HTTP_400_BAD_REQUEST
            )

        Registration.objects.create(user=request.user, event=event)
        return Response(
            {'message': 'Successfully registered for the event'},
            status=status.HTTP_201_CREATED
        )

    def delete(self, request, pk):
        try:
            event = Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return Response(
                {'error': 'Event not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        reg = Registration.objects.filter(user=request.user, event=event)
        if not reg.exists():
            return Response(
                {'error': 'You are not registered for this event'},
                status=status.HTTP_400_BAD_REQUEST
            )

        reg.delete()
        return Response(
            {'message': 'Successfully cancelled registration'},
            status=status.HTTP_200_OK
        )

class MyRegistrationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        registrations = Registration.objects.filter(
            user=request.user
        ).select_related('event').order_by('-registered_at')
        serializer = RegistrationSerializer(registrations, many=True)
        return Response(serializer.data)