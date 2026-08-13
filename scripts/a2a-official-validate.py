import json
import os
from importlib.metadata import version
from urllib.request import Request, urlopen

from a2a.types import AgentCard, SendMessageResponse
from google.protobuf.json_format import MessageToDict, ParseDict


BASE_URL = os.environ.get("VERIFY_BASE_URL", "http://127.0.0.1:3200")


with urlopen(f"{BASE_URL}/.well-known/agent-card.json") as response:
    card_json = json.load(response)

card = ParseDict(card_json, AgentCard(), ignore_unknown_fields=False)
assert card.supported_interfaces[0].protocol_binding == "JSONRPC"
assert card.supported_interfaces[0].protocol_version == "1.0"
assert card.version == "1.0.0"
assert [skill.id for skill in card.skills] == [
    "get_service_catalog",
    "check_serviceability",
    "estimate_standard_installation",
]

request_body = {
    "jsonrpc": "2.0",
    "id": "official-sdk-validation",
    "method": "SendMessage",
    "params": {
        "message": {
            "messageId": "official-sdk-message",
            "role": "ROLE_USER",
            "parts": [
                {
                    "data": {
                        "skill": "estimate_standard_installation",
                        "input": {
                            "postalCode": "77494",
                            "incomingLineSize": "1.00",
                            "sensorQuantity": 2,
                            "sensorCompatibilityConfirmed": True,
                            "batteryRequested": True,
                            "batteryCompatibilityConfirmed": True,
                            "annualCareRequested": True,
                            "propertyType": "single_family_residential",
                            "incomingLineSizeVerified": True,
                            "domesticMainAccessible": True,
                            "standardPipework": True,
                            "nearbyPower": True,
                            "wifiAvailable": True,
                            "dualMain": False,
                            "electricalModificationRequired": False,
                            "correctiveRepairRequired": False,
                            "irrigationRequested": False,
                            "fireSprinklerPresent": False,
                        },
                    },
                    "mediaType": "application/json",
                }
            ],
        }
    },
}

request = Request(
    f"{BASE_URL}/api/a2a",
    method="POST",
    headers={"A2A-Version": "1.0", "Content-Type": "application/json"},
    data=json.dumps(request_body).encode("utf-8"),
)
with urlopen(request) as response:
    assert response.headers["A2A-Version"] == "1.0"
    rpc_response = json.load(response)

send_message = ParseDict(
    rpc_response["result"],
    SendMessageResponse(),
    ignore_unknown_fields=False,
)
assert send_message.HasField("message")
assert send_message.message.role == 2  # ROLE_AGENT
assert send_message.message.parts[0].HasField("data")
assert send_message.message.parts[0].media_type == "application/json"
estimate = MessageToDict(send_message.message.parts[0].data)
assert estimate["oneTimeCatalogTotal"] == 2075
assert estimate["publishedCatalogTotal"] == 2075
assert estimate["recurringSelections"] == [{
    "serviceId": "HS-CARE-ANNUAL-001", "name": "Annual system care", "amount": 99,
    "currency": "USD", "billingDuration": "P1Y",
}]

print(
    json.dumps(
        {
            "a2aSdkVersion": version("a2a-sdk"),
            "agentCard": "valid",
            "sendMessageResponse": "valid",
            "protocolVersion": card.supported_interfaces[0].protocol_version,
            "oneTimeCatalogTotal": estimate["oneTimeCatalogTotal"],
            "recurringAmount": estimate["recurringSelections"][0]["amount"],
        }
    )
)
