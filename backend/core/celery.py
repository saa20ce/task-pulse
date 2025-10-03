import os
from celery import Celery
from dotenv import load_dotenv

load_dotenv()

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

app = Celery("core")

RABBIT_BROKER = f"amqp://{os.getenv('RABBITMQ_USER','guest')}:{os.getenv('RABBITMQ_PASS','guest')}@{os.getenv('RABBITMQ_HOST','rabbitmq')}:{os.getenv('RABBITMQ_PORT','5672')}//"
app.conf.broker_url = RABBIT_BROKER

# Optional: result backend (not needed for simple tasks)
# app.conf.result_backend = 'rpc://'

app.autodiscover_tasks()
