from django.conf.urls import include, url,patterns
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'map.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
                        url(r'^classify/',include('classify.urls')),
                        url(r'^admin/', include(admin.site.urls)),
                       )
