from django.conf import settings
from django.db import models


class Family(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="family_profile",
    )
    family_name = models.CharField(max_length=150)
    guardian_name = models.CharField(max_length=150)
    country = models.CharField(max_length=100, blank=True)
    contact_number = models.CharField(max_length=50)
    whatsapp_number = models.CharField(max_length=50, blank=True)
    whatsapp_group_link = models.URLField(blank=True)
    preferred_language = models.CharField(
        max_length=5,
        choices=[("en", "English"), ("ps", "Pashto"), ("fa", "Dari"), ("ar", "Arabic")],
        default="en",
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.family_name


class Student(models.Model):
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name="students")
    full_name = models.CharField(max_length=150)
    date_of_birth = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.full_name


class Course(models.Model):
    name_en = models.CharField(max_length=150)
    name_ps = models.CharField(max_length=150, blank=True)
    name_fa = models.CharField(max_length=150, blank=True)
    name_ar = models.CharField(max_length=150, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["sort_order", "name_en"]

    def __str__(self):
        return self.name_en


class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="enrollments")
    course = models.ForeignKey(Course, on_delete=models.PROTECT, related_name="enrollments")
    start_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[("active", "Active"), ("paused", "Paused"), ("completed", "Completed")],
        default="active",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["student", "course"], name="unique_student_course_enrollment")
        ]


class Admission(models.Model):
    STATUS = [("pending", "Pending"), ("accepted", "Accepted"), ("declined", "Declined")]
    guardian_name = models.CharField(max_length=150)
    family_name = models.CharField(max_length=150, blank=True)
    email = models.EmailField(blank=True)
    contact_number = models.CharField(max_length=50)
    country = models.CharField(max_length=100, blank=True)
    preferred_language = models.CharField(
        max_length=5,
        choices=[("en", "English"), ("ps", "Pashto"), ("fa", "Dari"), ("ar", "Arabic")],
        default="en",
    )
    student_names = models.CharField(max_length=500)
    course_interest = models.CharField(max_length=150, blank=True)
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.guardian_name} – {self.student_names}"


class TeacherProfile(models.Model):
    teacher_name = models.CharField(max_length=150, default="Ihsanullah Haseen")
    bio_en = models.TextField(blank=True)
    bio_ps = models.TextField(blank=True)
    bio_fa = models.TextField(blank=True)
    bio_ar = models.TextField(blank=True)
    qualifications = models.TextField(blank=True)
    whatsapp_contact_number = models.CharField(max_length=50, blank=True, default="+93709935345")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.teacher_name


class ClassSession(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="class_sessions")
    course = models.ForeignKey(Course, on_delete=models.PROTECT, related_name="class_sessions")
    class_datetime = models.DateTimeField()
    duration_minutes = models.PositiveSmallIntegerField(default=30)
    status = models.CharField(
        max_length=20,
        choices=[("scheduled", "Scheduled"), ("completed", "Completed"), ("cancelled", "Cancelled")],
        default="scheduled",
    )
    attendance = models.CharField(
        max_length=20,
        choices=[
            ("unrecorded", "Unrecorded"),
            ("present", "Present"),
            ("absent", "Absent"),
            ("excused", "Excused"),
        ],
        default="unrecorded",
    )
    whatsapp_link = models.URLField(blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["class_datetime"]


class Question(models.Model):
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name="questions")
    student = models.ForeignKey(
        Student, on_delete=models.SET_NULL, null=True, blank=True, related_name="questions"
    )
    question = models.TextField()
    answer = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    answered_at = models.DateTimeField(null=True, blank=True)
