from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from rest_framework import permissions, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView

from .models import (
    Admission,
    Course,
    Family,
    Student,
    ClassSession,
    Question,
)
from .serializers import AdmissionSerializer, CourseSerializer


class HealthView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request):
        return Response({"status": "ok"})


class AdmissionCreateView(CreateAPIView):
    queryset = Admission.objects.all()
    serializer_class = AdmissionSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def perform_create(self, serializer):
        admission = serializer.save()
        notify_to = settings.ADMISSION_NOTIFY_EMAIL
        subject = f"[Haseen Academy] New admission: {admission.guardian_name}"
        body = (
            f"New admission enquiry received.\n\n"
            f"Guardian: {admission.guardian_name}\n"
            f"Family: {admission.family_name or '—'}\n"
            f"Email: {admission.email or '—'}\n"
            f"Phone: {admission.contact_number}\n"
            f"Country: {admission.country or '—'}\n"
            f"Preferred language: {admission.preferred_language}\n"
            f"Student(s): {admission.student_names}\n"
            f"Course interest: {admission.course_interest or '—'}\n"
            f"Message: {admission.message or '—'}\n"
            f"Submitted at: {admission.created_at}\n"
        )
        # fail_silently: a misconfigured mailer must not fail the API response
        send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [notify_to], fail_silently=True)


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []


def require_staff(user, message):
    """Admin and teacher dashboards are both limited to staff accounts."""
    if not user.is_staff and not user.is_superuser:
        raise PermissionDenied(message)


def upcoming_sessions():
    return ClassSession.objects.filter(class_datetime__gte=timezone.now(), status="scheduled")


def open_questions_count():
    return Question.objects.filter(answer="").count()


def active_students_count():
    return Student.objects.filter(is_active=True).count()


class AdminDashboardView(APIView):
    def get(self, request):
        require_staff(request.user, "Administrator access is required.")
        return Response(
            {
                "families": Family.objects.count(),
                "students": active_students_count(),
                "pending_admissions": Admission.objects.filter(status="pending").count(),
                "courses": Course.objects.filter(is_active=True).count(),
                "classes": upcoming_sessions().count(),
                "open_questions": open_questions_count(),
            }
        )


class FamilyDashboardView(APIView):
    def get(self, request):
        try:
            family = request.user.family_profile
        except Family.DoesNotExist:
            raise PermissionDenied("This account is not linked to a family profile.")
        students = list(family.students.values("id", "full_name", "is_active"))
        sessions = (
            upcoming_sessions()
            .filter(student__family=family)
            .select_related("course", "student")
        )
        questions = family.questions.order_by("-created_at").values(
            "id", "question", "answer", "created_at"
        )
        return Response(
            {
                "family_name": family.family_name,
                "guardian_name": family.guardian_name,
                "students": students,
                "classes": [
                    {
                        "id": s.id,
                        "student_name": s.student.full_name,
                        "course_name": s.course.name_en,
                        "class_datetime": s.class_datetime,
                        "duration_minutes": s.duration_minutes,
                        "status": s.status,
                    }
                    for s in sessions
                ],
                "questions": list(questions),
            }
        )


class TeacherDashboardView(APIView):
    def get(self, request):
        require_staff(request.user, "Teacher access requires a staff account.")
        return Response(
            {
                "classes": list(
                    upcoming_sessions()
                    .select_related("course", "student")
                    .values(
                        "id",
                        "class_datetime",
                        "duration_minutes",
                        "course__name_en",
                        "student__full_name",
                    )[:100]
                ),
                "open_questions": open_questions_count(),
                "students": active_students_count(),
            }
        )


def role_for(user):
    """Which dashboard a user belongs to: superuser -> admin, staff -> teacher, linked family -> family."""
    if user.is_superuser:
        return "admin"
    if user.is_staff:
        return "teacher"
    if Family.objects.filter(user=user).exists():
        return "family"
    return None


class MeView(APIView):
    """The signed-in user and their role — the frontend uses this to route to the right dashboard."""

    def get(self, request):
        user = request.user
        role = role_for(user)
        if role is None:
            raise PermissionDenied("This account is not linked to the academy portal.")
        display = user.get_full_name().strip() or user.username
        if role == "family":
            display = user.family_profile.guardian_name or display
        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "display_name": display,
                "role": role,
            }
        )
