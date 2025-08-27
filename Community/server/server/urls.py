from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import  staticfiles_urlpatterns


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/authentication/',include('authentication.urls')),
    path('api/community/', include('community.urls')),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


urlpatterns  += staticfiles_urlpatterns()
