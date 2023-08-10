FROM rabbitmq:3.10.7-management

RUN apt-get update \
 && DEBIAN_FRONTEND=noninteractive apt-get upgrade -y \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y \
      curl

COPY rabbitmq-env.conf .
COPY rabbitmq.conf .