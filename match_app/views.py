from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework.exceptions import NotAuthenticated
from django.http import JsonResponse
from .models import Web3_model
from django.views.decorators.csrf import csrf_exempt
from web3 import Web3
import os
import requests
import datetime
import json

User = get_user_model()


class CurrentUserHistory(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise NotAuthenticated("Authorization header missing or invalid")

        token = auth_header.split(' ')[1]
        try:
            user = User.objects.get(auth_token=token)
        except User.DoesNotExist:
            raise NotAuthenticated("Invalid token")

        # Fetch raw game results from the contract:
        raw_results = get_game_results_by_username(user.username) or []

        # Transform raw results into the desired structure:
        response_data = []
        for item in raw_results:
            # Determine if current user is player1 or player2
            if item['player1'] == user.username:
                player_score = item['score1']
                opponent_score = item['score2']
                opponent_name = item['player2']
            else:
                player_score = item['score2']
                opponent_score = item['score1']
                opponent_name = item['player1']

            # Derive win/loss/draw
            if player_score > opponent_score:
                result_str = "Won"
            elif player_score < opponent_score:
                result_str = "Lost"
            else:
                result_str = "Draw"

            # Convert integer timestamp to ISO 8601 date string
            timestamp_int = item['timestamp']
            date_str = datetime.datetime.utcfromtimestamp(timestamp_int).isoformat() + "Z"

            response_data.append({
                "opponent": {
                    "avatar": "https://example.com/avatars/default_opponent.png",
                    "name": opponent_name,
                },
                "playerScore": player_score,
                "opponentScore": opponent_score,
                "result": result_str,
                "date": date_str
            })

        return Response(response_data)


class ProfileUserHistory(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise NotAuthenticated("Authorization header missing or invalid")

        token = auth_header.split(' ')[1]
        try:
            User.objects.get(auth_token=token)
        except User.DoesNotExist:
            raise NotAuthenticated("Invalid token")

        # Fetch the user whose profile history we want:
        try:
            target_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "No such user."}, status=404)

        # Fetch raw game results for the target user:
        raw_results = get_game_results_by_username(target_user.username) or []

        # Transform raw results into the desired structure:
        response_data = []
        for item in raw_results:
            # Determine if target_user is player1 or player2
            if item['player1'] == target_user.username:
                player_score = item['score1']
                opponent_score = item['score2']
                opponent_name = item['player2']
            else:
                player_score = item['score2']
                opponent_score = item['score1']
                opponent_name = item['player1']

            # Derive win/loss/draw
            if player_score > opponent_score:
                result_str = "Won"
            elif player_score < opponent_score:
                result_str = "Lost"
            else:
                result_str = "Draw"

            # Convert integer timestamp to ISO 8601 date string
            timestamp_int = item['timestamp']
            date_str = datetime.datetime.utcfromtimestamp(timestamp_int).isoformat() + "Z"

            response_data.append({
                "opponent": {
                    "avatar": "https://example.com/avatars/default_opponent.png",
                    "name": opponent_name,
                },
                "playerScore": player_score,
                "opponentScore": opponent_score,
                "result": result_str,
                "date": date_str
            })

        return Response(response_data)


def get_blockchain_connection():
    rpc_url = os.environ.get("RPC_URL")  # or other RPC URL
    web3 = Web3(Web3.HTTPProvider(rpc_url))

    if not web3.is_connected():
        print("Failed to connect to the blockchain")
        return None

    return web3 


def get_game_results_by_username(username):
    web3 = get_blockchain_connection()
    if not web3:
        return None

    # Example: calling a separate service that returns { status, address, abi }
    url = "http://thirdweb:3333/get_contractAddress"
    payload = {}
    headers = {}

    try:
        response = requests.request("GET", url, headers=headers, data=payload)
        response = response.json()
    except Exception as e:
        print(f"Error fetching contract address: {e}")
        return None

    if response.get('status') != 'success':
        return None

    address = response.get('address')
    
    web3_address = Web3_model.objects.first()  # Get the first instance
    if web3_address:
        # Update if no address is set
        if not web3_address.address or len(web3_address.address) == 0:
            web3_address.address = str(address)
            web3_address.save()
    else:
        print("No Web3_model instances found!")

    contract_address = Web3.to_checksum_address(address)
    contract_abi = response.get('abi')
    contract = web3.eth.contract(address=contract_address, abi=contract_abi)

    try:
        result = contract.functions.getGameResultsByUsername(username).call()

        ids = result[0]
        player1s = result[1]
        player2s = result[2]
        score1s = result[3]
        score2s = result[4]
        winners = result[5]
        timestamps = result[6]

        game_results = []
        for i in range(len(ids)):
            game_result = {
                "id": ids[i],
                "player1": player1s[i],
                "player2": player2s[i],
                "score1": score1s[i],
                "score2": score2s[i],
                "winner": winners[i],
                "timestamp": timestamps[i]
            }
            game_results.append(game_result)
        return game_results

    except Exception as e:
        print(f"Error calling getGameResultsByUsername: {e}")
        return None


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
        Web3_model.objects.get_or_create(id=0)
        return JsonResponse({'status': 'failed', 'message': 'No contract address found.'})


@csrf_exempt
def update_contract_address_base(request):
    """
    Update or create the Web3 contract address.

    Expected JSON POST data:
    {
        "address": "<new_contract_address>"
    }
    """
    if request.method == 'POST':
        try:
            # Parse JSON from request body
            data = json.loads(request.body)
            new_address = data.get('address')
        except json.JSONDecodeError:
            return JsonResponse(
                {'status': 'error', 'message': 'Invalid JSON in request body.'},
                status=400
            )

        if not new_address:
            return JsonResponse(
                {'status': 'error', 'message': 'No contract address provided.'},
                status=400
            )

        web3_address = Web3_model.objects.first()
        if web3_address:
            # Update existing address
            web3_address.address = new_address
            web3_address.save()
            return JsonResponse(
                {'status': 'success', 'message': 'Contract address updated.'}
            )
        else:
            # Create a new record if none exists
            Web3_model.objects.create(address=new_address)
            return JsonResponse(
                {'status': 'success', 'message': 'New contract address created.'}
            )
    else:
        return JsonResponse(
            {'status': 'error', 'message': 'Method not allowed. Use POST.'},
            status=405
        )