from django.urls import path
from .views import get_contract_address_base, update_contract_address_base

urlpatterns = [
    path('get-contract-address', get_contract_address_base, name='get_contract_address'),
    path('update-contract-address', update_contract_address_base, name='update_contract_address'),
]