import os
import json
import redis
import logging
from typing import Callable, Any, Dict, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("EventBus")

class EventBus:
    def __init__(self, host=None, port=None, password=None):
        self.host = host or os.getenv("REDIS_HOST", "localhost")
        self.port = int(port or os.getenv("REDIS_PORT", 6379))
        self.password = password or os.getenv("REDIS_PASSWORD", None)
        
        try:
            self.redis = redis.Redis(
                host=self.host, 
                port=self.port, 
                password=self.password, 
                decode_responses=True
            )
            self.redis.ping()
            logger.info(f"Connected to Redis at {self.host}:{self.port}")
        except redis.ConnectionError as e:
            logger.error(f"Could not connect to Redis: {e}")
            self.redis = None

    def publish(self, stream_name: str, data: Dict[str, Any]):
        """Publishes a message to a Redis Stream."""
        if not self.redis:
            logger.warning(f"Redis not connected. Skipping publish to {stream_name}")
            return None
        
        try:
            # Redis Streams expect a dictionary of strings
            payload = {"data": json.dumps(data)}
            message_id = self.redis.xadd(stream_name, payload)
            logger.info(f"Published to {stream_name}: {message_id}")
            return message_id
        except Exception as e:
            logger.error(f"Error publishing to {stream_name}: {e}")
            return None

    async def start_subscriber_task(self, stream_name: str, group_name: str, consumer_name: str, callback: Callable[[Dict[str, Any]], Any]):
        """
        Starts an asynchronous background task to subscribe to a Redis Stream.
        """
        import asyncio
        import functools

        if not self.redis:
            logger.warning(f"Redis not connected. Cannot subscribe to {stream_name}")
            return

        # Create consumer group if it doesn't exist
        try:
            self.redis.xgroup_create(stream_name, group_name, id='0', mkstream=True)
        except redis.exceptions.ResponseError as e:
            if "already exists" not in str(e):
                logger.error(f"Error creating group {group_name}: {e}")

        logger.info(f"Subscribed to {stream_name} as {consumer_name} in group {group_name}")
        
        while True:
            try:
                # Read new messages (non-blocking in terms of loop, but xreadgroup is blocking with timeout)
                # We use a small block time to remain responsive
                messages = await asyncio.get_event_loop().run_in_executor(
                    None, 
                    functools.partial(self.redis.xreadgroup, group_name, consumer_name, {stream_name: '>'}, count=1, block=5000)
                )
                
                if messages:
                    for stream, msg_list in messages:
                        for msg_id, payload in msg_list:
                            data = json.loads(payload['data'])
                            logger.info(f"Received message {msg_id} from {stream}")
                            
                            # Process the message (can be async or sync)
                            if asyncio.iscoroutinefunction(callback):
                                await callback(data)
                            else:
                                callback(data)
                            
                            # Acknowledge the message
                            self.redis.xack(stream_name, group_name, msg_id)
            except Exception as e:
                logger.error(f"Error in subscription task for {stream_name}: {e}")
                await asyncio.sleep(1)

    # ── Shared Memory (Patient Context) ──────────────────────────────────────────
    
    def set_context(self, patient_id: str, context: Dict[str, Any]):
        """Sets a shared patient context object in Redis."""
        if not self.redis:
            return
        try:
            key = f"ctx:{patient_id}"
            self.redis.set(key, json.dumps(context))
            logger.info(f"Context updated for patient: {patient_id}")
        except Exception as e:
            logger.error(f"Error setting context for {patient_id}: {e}")

    def get_context(self, patient_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a shared patient context object from Redis."""
        if not self.redis:
            return None
        try:
            key = f"ctx:{patient_id}"
            data = self.redis.get(key)
            return json.loads(data) if data else None
        except Exception as e:
            logger.error(f"Error getting context for {patient_id}: {e}")
            return None
