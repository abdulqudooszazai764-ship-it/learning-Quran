from django.contrib import admin
from .models import Family, Student, Course, Enrollment, Admission, TeacherProfile, ClassSession, Question
admin.site.register([Family, Student, Course, Enrollment, Admission, TeacherProfile, ClassSession, Question])
