"""
PostgreSQL Database Connection Management
Replaces SQLite with PostgreSQL for multi-worker support
"""
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2 import pool
from contextlib import contextmanager

# Database configuration from environment variables
DATABASE_URL = os.getenv("DATABASE_URL")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "database")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
POSTGRES_DB = os.getenv("POSTGRES_DB", "simplypop_db")
POSTGRES_USER = os.getenv("POSTGRES_USER", "jgijon")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")

# Connection pool for efficient connection management
# This allows multiple workers to share database connections
connection_pool = None

def init_connection_pool(minconn=1, maxconn=10):
    """Initialize the PostgreSQL connection pool"""
    global connection_pool

    if connection_pool is None:
        try:
            connection_pool = psycopg2.pool.SimpleConnectionPool(
                minconn,
                maxconn,
                host=POSTGRES_HOST,
                port=POSTGRES_PORT,
                database=POSTGRES_DB,
                user=POSTGRES_USER,
                password=POSTGRES_PASSWORD
            )
            print(f"✓ Database connection pool created successfully")
        except Exception as e:
            print(f"✗ Error creating connection pool: {e}")
            raise

def get_connection():
    """
    Get a database connection from the pool.
    Returns a connection with dictionary-like cursor (similar to sqlite3.Row)
    """
    global connection_pool

    if connection_pool is None:
        init_connection_pool()

    try:
        conn = connection_pool.getconn()
        # Set autocommit to False to match SQLite behavior
        conn.autocommit = False
        return conn
    except Exception as e:
        print(f"✗ Error getting connection from pool: {e}")
        raise

def return_connection(conn):
    """Return a connection back to the pool"""
    global connection_pool

    if connection_pool is not None and conn is not None:
        connection_pool.putconn(conn)

@contextmanager
def get_db_connection():
    """
    Context manager for database connections.
    Automatically returns connection to pool after use.

    Usage:
        with get_db_connection() as conn:
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            cursor.execute("SELECT * FROM gallery")
            results = cursor.fetchall()
    """
    conn = get_connection()
    try:
        yield conn
    finally:
        return_connection(conn)

def close_connection_pool():
    """Close all connections in the pool (call on application shutdown)"""
    global connection_pool

    if connection_pool is not None:
        connection_pool.closeall()
        connection_pool = None
        print("✓ Database connection pool closed")

def execute_query(query, params=None, fetch=True, cursor_factory=RealDictCursor):
    """
    Helper function to execute a query and return results.

    Args:
        query: SQL query string
        params: Query parameters (tuple or dict)
        fetch: Whether to fetch results (True for SELECT, False for INSERT/UPDATE/DELETE)
        cursor_factory: Cursor factory (default: RealDictCursor for dict-like results)

    Returns:
        For SELECT: List of dictionaries
        For INSERT/UPDATE/DELETE: Number of affected rows
    """
    with get_db_connection() as conn:
        cursor = conn.cursor(cursor_factory=cursor_factory)
        try:
            cursor.execute(query, params or ())

            if fetch:
                results = cursor.fetchall()
                conn.commit()
                return results
            else:
                conn.commit()
                return cursor.rowcount
        except Exception as e:
            conn.rollback()
            print(f"✗ Database error: {e}")
            raise
        finally:
            cursor.close()
