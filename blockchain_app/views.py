from django.http import JsonResponse
from .models import Web3_model       # Adjust import path to wherever Web3_model is located


def get_contract_address_base(request):
    """
    Fetch the Web3 contract address.
    """
    web3_address = Web3_model.objects.first()
    if web3_address:
        print("************")
        print(web3_address.address)
        print("************")
        return JsonResponse({'status': 'success', 'address': web3_address.address})
    else:
        print("No Web3_model instances found!")
        # The get_or_create call below will return a tuple: (instance, created)
        # If you really want to create a new record when none exists, you might do:
        # web3_address, created = Web3_model.objects.get_or_create(id=0)
        Web3_model.objects.get_or_create(id=0)
        return JsonResponse({'status': 'failed', 'message': 'No contract address found.'})


def update_contract_address_base(request):
    """
    Update or create the Web3 contract address.

    Expected POST data:
    {
        "address": "<new_contract_address>"
    }
    """
    if request.method == 'POST':
        new_address = request.POST.get('address')  # Or request.data.get('address') if using DRF

        if not new_address:
            return JsonResponse(
                {'status': 'error', 'message': 'No contract address provided.'},
                status=400
            )

        # Try to retrieve the first contract address or create a new one if none exist.
        web3_address = Web3_model.objects.first()

        if web3_address:
            # Update existing
            web3_address.address = new_address
            web3_address.save()
            return JsonResponse({'status': 'success', 'message': 'Contract address updated.'})
        else:
            # Create new
            web3_address = Web3_model.objects.create(address=new_address)
            return JsonResponse({'status': 'success', 'message': 'New contract address created.'})

    else:
        # Only allow POST
        return JsonResponse(
            {'status': 'error', 'message': 'Method not allowed. Use POST.'},
            status=405
        )


