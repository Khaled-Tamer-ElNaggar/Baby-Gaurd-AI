import mysql.connector
from flask import current_app

def get_db_config():
    return dict(
        host='localhost',
        port=3306,
        database='babyguardai',
        user='root',
        password='1234'
    )

def create_db_connection():
    return mysql.connector.connect(**get_db_config())
