from rest_framework import serializers
from .models import Admission, Course


class AdmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admission
        fields = [
            "id",
            "guardian_name",
            "family_name",
            "email",
            "contact_number",
            "country",
            "preferred_language",
            "student_names",
            "course_interest",
            "message",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            "id",
            "name_en",
            "name_ps",
            "name_fa",
            "name_ar",
            "description",
            "is_active",
            "sort_order",
        ]
