# FROM python:3.12-slim

# WORKDIR /app

# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# COPY . .

# EXPOSE 8001
# CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8001"]

FROM python:3.12-slim

# Create non-root user for security
RUN useradd -m -u 1000 appuser

# Set working directory
WORKDIR /app

# Install dependencies as root
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create necessary directories with proper permissions
RUN mkdir -p /app/simplypop/gallery /app/simplypop/client && \
    chown -R appuser:appuser /app

# Copy application code
COPY --chown=appuser:appuser . .

# Create wait-for-postgres script
RUN echo '#!/bin/sh\n\
set -e\n\
\n\
host="$1"\n\
shift\n\
\n\
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$host" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "\\q"; do\n\
  >&2 echo "Postgres is unavailable - sleeping"\n\
  sleep 1\n\
done\n\
\n\
>&2 echo "Postgres is up - executing command"\n\
exec "$@"\n\
' > /wait-for-postgres.sh && chmod +x /wait-for-postgres.sh

# Install PostgreSQL client for wait script
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8001/health')" || exit 1

# Run application with 2 workers (optimized for i3-6100 dual-core CPU)
CMD ["/bin/sh", "-c", "/wait-for-postgres.sh \"$POSTGRES_HOST\" uvicorn app:app --host 0.0.0.0 --port 8001 --workers 2"]