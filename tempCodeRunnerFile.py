        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': user['id'],
                'name': user['user_name'],
                'email': user['user_email'],
                'birthday': user['user_birthday'],
                'blood_type': user['blood_type'],
                'join_date': user['join_date'],
                'dark_mode': user['dark_mode'],
                'font_size': user['font_size']
            }
        }),