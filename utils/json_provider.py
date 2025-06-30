import decimal, uuid, base64, datetime
from flask.json.provider import DefaultJSONProvider

class CustomJSON(DefaultJSONProvider):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal): return float(obj)
        if isinstance(obj, (bytes, bytearray)): return base64.b64encode(obj).decode()
        if isinstance(obj, (datetime.date, datetime.datetime, datetime.time)): return obj.isoformat()
        if isinstance(obj, datetime.timedelta): return obj.total_seconds()
        if isinstance(obj, uuid.UUID): return str(obj)
        return super().default(obj)
