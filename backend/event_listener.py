import time
import json
import redis
import threading
from flask_socketio import SocketIO

def start_redis_listener(socketio: SocketIO, redis_host='localhost', redis_port=6379):
    def listener():
        r = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)
        streams = {
            'triage_result': '$',
            'appointment_scheduled': '$',
            'vital_alert': '$',
            'risk_score_updated': '$',
            'decision_ready': '$',
            'ehr_updated': '$',
            'medication_alert': '$',
            'emergency_alert': '$',
        }
        
        print("Backend Redis Listener Started...")
        
        while True:
            try:
                # Block for 1 second for new messages
                messages = r.xread(streams, block=1000)
                if messages:
                    for stream, msg_list in messages:
                        for msg_id, payload in msg_list:
                            data = json.loads(payload['data'])
                            print(f"Backend received {stream}: {data}")
                            
                            # Push to all connected clients via SocketIO
                            socketio.emit('event_bus_message', {
                                'stream': stream,
                                'data': data
                            })
                            
                            # Update the stream last ID to read new messages only
                            # streams[stream] = msg_id # This isn't quite right for xread with multiple streams and '$'
            except Exception as e:
                print(f"Error in Redis listener: {e}")
                time.sleep(1)

    thread = threading.Thread(target=listener, daemon=True)
    thread.start()
