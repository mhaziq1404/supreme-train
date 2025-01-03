from django.urls import path
from .views import CurrentUserHistory, ProfileUserHistory, get_contract_address_base, update_contract_address_base

urlpatterns = [
    path('history/me', CurrentUserHistory.as_view(), name='history_mine'),
    path('history/<int:user_id>', ProfileUserHistory.as_view(), name='history_player'),
    path('get-contract-address', get_contract_address_base, name='get_contract_address'),
    path('update-contract-address', update_contract_address_base, name='update_contract_address'),
]