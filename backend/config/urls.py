from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from academy.views import AdmissionCreateView, CourseViewSet, AdminDashboardView, FamilyDashboardView, TeacherDashboardView, HealthView, MeView
router = DefaultRouter()
router.register('courses', CourseViewSet, basename='course')
urlpatterns = [path('django-admin/', admin.site.urls), path('api/health/', HealthView.as_view()), path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), path('api/me/', MeView.as_view(), name='me'), path('api/admissions/', AdmissionCreateView.as_view(), name='admission-create'), path('api/dashboard/admin/', AdminDashboardView.as_view()), path('api/dashboard/family/', FamilyDashboardView.as_view()), path('api/dashboard/teacher/', TeacherDashboardView.as_view()), path('api/', include(router.urls))]
